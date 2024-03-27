# -*- coding: utf-8 -*-
"""
Smartlift views

"""
from __future__ import annotations

import json
import random
from dataclasses import dataclass
from typing import TypedDict

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from . import models
from .models import Lift, LiftRequest


@dataclass
class RequestData:
    """Simple dataclass representing a LiftRequest payload"""

    from_floor: models.Floor
    to_floor: models.Floor


@dataclass
class MoveData:
    """Simple dataclass representing a LiftMove payload"""

    lift: models.Lift
    floor: models.Floor


def assign_lift(request: RequestData) -> models.Lift:
    """
    Calculates which lift the lift requester should use
    :param request: RequestData
    :return: a Lift instance
    """
    serviced_floors = models.ServicedFloor.objects.select_related().filter(
        floor=request.from_floor.id,
    )

    lifts = [serviced_floor.lift for serviced_floor in serviced_floors]

    return random.choice(lifts)


def get_floor(floor_level: int) -> models.Floor:
    """
    Returns a Floor for the given level
    :param floor_level:
    :return: Floor instance
    """
    floor = models.Floor.objects.get(floor_level=floor_level)
    return floor


def get_lift(lift_id: int) -> models.Lift:
    """
    Returns a Lift for the given lift id
    :param lift_id:
    :return: Lift instance
    """
    lift = models.Lift.objects.get(id=lift_id)
    return lift


def get_serviced_floor(
    floor: models.Floor,
    lift: models.Lift,
) -> models.ServicedFloor:
    """
    Returns a ServicedFloor for the given Floor and Lift
    :param floor:
    :param lift:
    :return:
    """
    serviced_floor = models.ServicedFloor.objects.get(lift=lift.id, floor=floor.id)
    return serviced_floor


@csrf_exempt
def request_elevator(request: HttpRequest) -> HttpResponse:
    """
    A request to get an elevator from one floor to another
    :param request:
    :return:
    """
    if request.method == "POST":
        data = json.loads(request.body)
        try:
            request_data = RequestData(
                from_floor=get_floor(floor_level=data.get("from_floor")),
                to_floor=get_floor(floor_level=data.get("to_floor")),
            )
        except models.Floor.DoesNotExist:
            return JsonResponse({"error": "Unknown floor"}, status=404)
        lift_to_assign = assign_lift(request=request_data)

        lift_request = LiftRequest(
            lift=lift_to_assign,
            floor_from=get_serviced_floor(floor=request_data.from_floor, lift=lift_to_assign),
            floor_to=get_serviced_floor(floor=request_data.to_floor, lift=lift_to_assign),
        )
        lift_request.save()

        return JsonResponse({"lift": lift_to_assign.id})
    return JsonResponse({"error": "Only POST requests are supported."}, status=405)


@csrf_exempt
def move_elevator(request: HttpRequest) -> HttpResponse:
    """
    Moves the elevator to a specific floor
    :param request:
    :return:
    """
    if request.method == "POST":
        data = json.loads(request.body)

        try:
            move_data = MoveData(
                floor=get_floor(floor_level=data.get("floor")),
                lift=get_lift(lift_id=data.get("lift")),
            )

            serviced_floor = get_serviced_floor(floor=move_data.floor, lift=move_data.lift)
        except (
            models.Floor.DoesNotExist,
            models.Lift.DoesNotExist,
            models.ServicedFloor.DoesNotExist,
        ):
            return JsonResponse({"error": "Invalid Request: The lift does not service the requested floor"}, status=404)
        move_data.lift.current_floor = move_data.floor
        move_data.lift.save()

        lift_requests = LiftRequest.objects.select_related().filter(
            lift=move_data.lift, status=LiftRequest.RequestState.PENDING, floor_to=serviced_floor
        )
        lift_request: LiftRequest
        for lift_request in lift_requests:
            lift_request.status = LiftRequest.RequestState.COMPLETED
            lift_request.save()

        return JsonResponse({})
    return JsonResponse({"error": "Only POST requests are supported."}, status=405)


def get_lift_status(request: HttpRequest) -> HttpResponse:
    """
    Get the status of all lifts in the building
    {
        lifts: {
            [key: number]: {
                "floor": number,
                "destinations": number[]
            };
        };
    }
    :param request:
    :return:
    """
    if request.method == "GET":

        lifts = Lift.objects.select_related().all()
        lift_status: dict[str, dict] = {"lifts": {}}
        if len(lifts) > 0:
            for lift in lifts:
                lift_requests = LiftRequest.objects.select_related().filter(lift=lift, status=LiftRequest.RequestState.PENDING)

                # Creates a unique set of floors
                floors_from = {lift_request.floor_from.floor.floor_level for lift_request in lift_requests}
                floors_to = {lift_request.floor_to.floor.floor_level for lift_request in lift_requests}
                floors = floors_from.union(floors_to)

                if lift.current_floor is not None:
                    lift_status["lifts"][lift.id] = {
                        "floor": lift.current_floor.floor_level,
                        "destinations": list(floors),
                    }
        return JsonResponse(lift_status)
    return JsonResponse({"error": "Only GET requests are supported."}, status=405)


def get_lift_config(request: HttpRequest) -> HttpResponse:
    """
    Returns lift configuration
    {
        lifts: {
            [key: number]: {
                serviced_floors: number[];
            };
        };
    }
    :param request:
    :return:
    """
    if request.method == "GET":
        lift_config: dict[str, dict] = {"lifts": {}}
        lifts = models.Lift.objects.all()
        for lift in lifts:
            lift_config["lifts"][int(lift.id)] = {"serviced_floors": []}
            serviced_floors = models.ServicedFloor.objects.filter(lift_id=lift.id)
            for service in serviced_floors:
                lift_config["lifts"][int(lift.id)]["serviced_floors"].append(service.floor.floor_level)
        return JsonResponse(lift_config)
    return JsonResponse({"error": "Only GET requests are supported."}, status=405)


def get_building_config(request: HttpRequest) -> HttpResponse:
    """
        Gets the whole building configuration
        {
            numberOfLifts: number,
            floors: {
                level: number,
                name: string,
                panels: number
            },
        }
    :param request: HttpRequest
    :return: HttpResponse
    """

    class FloorConfig(TypedDict):
        """Floor configuration typed dict"""

        level: int
        name: str
        panels: int

    class BuildingConfig(TypedDict):
        """Building configuration typed dict"""

        numberOfLifts: int
        floors: list[FloorConfig]

    if request.method == "GET":
        lifts = models.Lift.objects.all()
        building_config: BuildingConfig = {
            "numberOfLifts": lifts.count(),
            "floors": [],
        }
        floors = models.Floor.objects.all()
        for floor in floors:
            floor_config: FloorConfig = {
                "level": floor.floor_level,
                "name": floor.floor_name,
                "panels": floor.control_panels,
            }
            building_config["floors"].append(floor_config)

        if len(building_config["floors"]) > 0:
            building_config["floors"] = sorted(building_config["floors"], key=lambda d: d["level"], reverse=True)
        return JsonResponse(building_config)
    return JsonResponse({"error": "Only GET requests are supported."}, status=405)
