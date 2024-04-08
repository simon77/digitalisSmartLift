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
    floor3 = create_floor(name="Third", level=3, panels=1)

    lift1 = Lift.objects.create(current_floor=floor0)
    lift2 = Lift.objects.create(current_floor=floor3)
    lift3 = Lift.objects.create(current_floor=floor1)
    lift4 = Lift.objects.create(current_floor=floor0)

    create_serviced_floor(floor=floor0, lift=lift1)
    create_serviced_floor(floor=floor1, lift=lift1)
    create_serviced_floor(floor=floor2, lift=lift1)
    create_serviced_floor(floor=floor3, lift=lift1)

    create_serviced_floor(floor=floor0, lift=lift2)
    create_serviced_floor(floor=floor3, lift=lift2)

    create_serviced_floor(floor=floor0, lift=lift3)
    create_serviced_floor(floor=floor1, lift=lift3)
    create_serviced_floor(floor=floor2, lift=lift3)

    create_serviced_floor(floor=floor0, lift=lift4)
    create_serviced_floor(floor=floor1, lift=lift4)


@pytest.fixture
def create_requests(create_building):
    floor0 = Floor.objects.get(floor_level=0)
    floor1 = Floor.objects.get(floor_level=1)
    floor2 = Floor.objects.get(floor_level=2)
    floor3 = Floor.objects.get(floor_level=3)

    lift1 = Lift.objects.get(id=1)
    lift2 = Lift.objects.get(id=2)
    lift3 = Lift.objects.get(id=3)
    lift4 = Lift.objects.get(id=4)

    lift1_serviced_floor0 = ServicedFloor.objects.get(floor=floor0, lift=lift1)
    lift1_serviced_floor1 = ServicedFloor.objects.get(floor=floor1, lift=lift1)
    lift1_serviced_floor2 = ServicedFloor.objects.get(floor=floor2, lift=lift1)
    lift1_serviced_floor3 = ServicedFloor.objects.get(floor=floor3, lift=lift1)

    lift2_serviced_floor0 = ServicedFloor.objects.get(floor=floor0, lift=lift2)
    lift2_serviced_floor3 = ServicedFloor.objects.get(floor=floor3, lift=lift2)

    lift3_serviced_floor0 = ServicedFloor.objects.get(floor=floor0, lift=lift3)
    lift3_serviced_floor1 = ServicedFloor.objects.get(floor=floor1, lift=lift3)
    lift3_serviced_floor2 = ServicedFloor.objects.get(floor=floor2, lift=lift3)

    lift4_serviced_floor0 = ServicedFloor.objects.get(floor=floor0, lift=lift4)
    lift4_serviced_floor1 = ServicedFloor.objects.get(floor=floor1, lift=lift4)

    LiftRequest.objects.create(floor_from=lift1_serviced_floor0, floor_to=lift1_serviced_floor1, lift=lift1)
    LiftRequest.objects.create(floor_from=lift1_serviced_floor1, floor_to=lift1_serviced_floor0, lift=lift1)
    LiftRequest.objects.create(floor_from=lift1_serviced_floor1, floor_to=lift1_serviced_floor2, lift=lift1)
    LiftRequest.objects.create(floor_from=lift1_serviced_floor1, floor_to=lift1_serviced_floor3, lift=lift1)

    LiftRequest.objects.create(floor_from=lift2_serviced_floor0, floor_to=lift2_serviced_floor3, lift=lift2)
    LiftRequest.objects.create(floor_from=lift2_serviced_floor3, floor_to=lift2_serviced_floor0, lift=lift2)
