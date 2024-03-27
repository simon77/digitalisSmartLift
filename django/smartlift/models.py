# -*- coding: utf-8 -*-
"""
Smartlift models

"""
from django.db import models


class Floor(models.Model):
    """Floor model"""

    floor_level = models.SmallIntegerField(default=0)
    floor_name = models.CharField(max_length=255)
    control_panels = models.SmallIntegerField(default=1)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return str(f"{self.floor_name} - {self.floor_level}")


class Lift(models.Model):
    """Lift model"""

    created = models.DateTimeField(auto_now_add=True)
    current_floor = models.ForeignKey(Floor, on_delete=models.DO_NOTHING, default=None, blank=True, null=True)


class ServicedFloor(models.Model):
    """Serviced Floor Model. Serviced floors are those where the lift stops"""

    floor = models.ForeignKey(Floor, on_delete=models.CASCADE)
    lift = models.ForeignKey(Lift, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return str(f"{self.lift} - {self.floor}")


class LiftRequest(models.Model):
    """
    Lift request class. Used to keep track of lift requests and a history of requests
    """

    class RequestState(models.TextChoices):
        """Class to define Request state literals"""

        PENDING = "PENDING"
        COMPLETED = "COMPLETED"

    floor_from = models.ForeignKey(ServicedFloor, on_delete=models.CASCADE, related_name="lift_request_from_floor")
    floor_to = models.ForeignKey(ServicedFloor, on_delete=models.CASCADE, related_name="lift_request_from_to")
    lift = models.ForeignKey(Lift, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=10,
        choices=RequestState.choices,
        default=RequestState.PENDING,
    )
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
