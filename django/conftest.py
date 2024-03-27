import pytest

from smartlift.models import Floor, Lift, LiftRequest, ServicedFloor


@pytest.fixture
def create_floor():
    def make_floor(level: int, name: str, panels: int = 0) -> Floor:
        floor = Floor.objects.create(
            floor_name=name,
            floor_level=level,
            control_panels=panels,
        )
        return floor

    yield make_floor


@pytest.fixture
def create_serviced_floor():
    def make_serviced_floor(floor: Floor, lift: Lift) -> Floor:
        serviced_floor = ServicedFloor.objects.create(
            floor=floor,
            lift=lift,
        )
        return serviced_floor

    yield make_serviced_floor


@pytest.fixture
def create_building(create_floor, create_serviced_floor):

    floor0 = create_floor(name="Ground", level=0, panels=2)
    floor1 = create_floor(name="First", level=1, panels=1)
    floor2 = create_floor(name="Second", level=2, panels=1)

    lift1 = Lift.objects.create(current_floor=floor0)
    lift2 = Lift.objects.create(current_floor=floor0)
    lift3 = Lift.objects.create(current_floor=floor0)

    create_serviced_floor(floor=floor0, lift=lift1)
    create_serviced_floor(floor=floor1, lift=lift1)
    create_serviced_floor(floor=floor2, lift=lift1)

    create_serviced_floor(floor=floor0, lift=lift2)
    create_serviced_floor(floor=floor1, lift=lift2)

    create_serviced_floor(floor=floor0, lift=lift3)
    create_serviced_floor(floor=floor2, lift=lift3)


@pytest.fixture
def create_requests(create_building):
    floor0 = Floor.objects.get(floor_level=0)
    floor1 = Floor.objects.get(floor_level=1)
    lift1 = Lift.objects.get(id=1)
    serviced_floor0 = ServicedFloor.objects.get(floor=floor0, lift=lift1)
    serviced_floor1 = ServicedFloor.objects.get(floor=floor1, lift=lift1)
    lift_request = LiftRequest.objects.create(floor_from=serviced_floor0, floor_to=serviced_floor1, lift=lift1)
