import datetime as dt

import pytest
import time_machine
from dateutil import tz

from smartlift.models import Floor, Lift, LiftRequest, ServicedFloor


@time_machine.travel("2024-03-25 15:00 +0000", tick=False)
@pytest.mark.django_db
def test_lift_create():
    now = dt.datetime.now(tz.tzutc())
    lift = Lift.objects.create()
    assert Lift.objects.count() == 1
    assert lift.current_floor is None
    assert lift.created == now


@time_machine.travel("2024-03-25 15:00 +0000", tick=False)
@pytest.mark.django_db
def test_floor_create(create_floor):
    now = dt.datetime.now(tz.tzutc())
    floor = create_floor(name="Ground", level=0)
    assert Floor.objects.count() == 1
    assert floor.floor_name == "Ground"
    assert floor.floor_level == 0
    assert floor.created == now


@time_machine.travel("2024-03-25 15:00 +0000", tick=False)
@pytest.mark.django_db
def test_serviced_floor_create(create_floor, create_serviced_floor):
    now = dt.datetime.now(tz.tzutc())
    floor = create_floor(name="Ground", level=0)
    lift1 = Lift.objects.create()
    serviced_floor = create_serviced_floor(floor=floor, lift=lift1)
    assert ServicedFloor.objects.count() == 1
    assert serviced_floor.created == now


@time_machine.travel("2024-03-25 15:00 +0000", tick=False)
@pytest.mark.django_db
def test_lift_request_create(create_floor, create_serviced_floor):
    now = dt.datetime.now(tz.tzutc())
    floor0 = create_floor(name="Ground", level=0)
    floor1 = create_floor(name="First", level=1)
    lift1 = Lift.objects.create()
    serviced_floor0 = create_serviced_floor(floor=floor0, lift=lift1)
    serviced_floor1 = create_serviced_floor(floor=floor1, lift=lift1)
    lift_request = LiftRequest.objects.create(floor_from=serviced_floor0, floor_to=serviced_floor1, lift=lift1)
    assert LiftRequest.objects.count() == 1
    assert lift_request.created == now
    assert lift_request.updated == now
    assert lift_request.status == LiftRequest.RequestState.PENDING
