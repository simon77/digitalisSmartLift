import json

import pytest

from django.urls import reverse


@pytest.mark.django_db
def test_get_building_config_empty(client):
    url = reverse("building_config")
    response = client.get(url)
    assert response.status_code == 200
    assert json.loads(response.content) == {
        "floors": [],
        "numberOfLifts": 0,
    }


@pytest.mark.django_db
def test_get_building_config(client, create_building):
    url = reverse("building_config")
    response = client.get(url)
    assert response.status_code == 200
    assert json.loads(response.content) == {
        "floors": [
            {
                "level": 3,
                "name": "Third",
                "panels": 1,
            },
            {
                "level": 2,
                "name": "Second",
                "panels": 1,
            },
            {
                "level": 1,
                "name": "First",
                "panels": 1,
            },
            {
                "level": 0,
                "name": "Ground",
                "panels": 2,
            },
        ],
        "numberOfLifts": 4,
    }


@pytest.mark.django_db
def test_get_lift_config(client, create_building):
    url = reverse("lift_config")
    response = client.get(url)
    assert response.status_code == 200
    assert json.loads(response.content) == {
        "lifts": {
            "1": {"serviced_floors": [0, 1, 2, 3]},
            "2": {"serviced_floors": [0, 3]},
            "3": {"serviced_floors": [0, 1, 2]},
            "4": {"serviced_floors": [0, 1]},
        }
    }


@pytest.mark.django_db
def test_get_lift_status_zero_requests(client, create_building):
    url = reverse("lift_status")
    response = client.get(url)
    assert response.status_code == 200
    assert json.loads(response.content) == {
        "lifts": {
            "1": {"destinations": [], "floor": 0},
            "2": {"destinations": [], "floor": 3},
            "3": {"destinations": [], "floor": 1},
            "4": {"destinations": [], "floor": 0},
        }
    }


@pytest.mark.django_db
def test_get_lift_status(client, create_requests):
    url = reverse("lift_status")
    response = client.get(url)
    assert response.status_code == 200
    assert json.loads(response.content) == {
        "lifts": {
            "1": {"destinations": [1, 2, 3], "floor": 0},
            "2": {"destinations": [0], "floor": 3},
            "3": {"destinations": [], "floor": 1},
            "4": {"destinations": [], "floor": 0},
        },
    }


@pytest.mark.django_db
def test_post_lift_request(client, create_requests):
    url = reverse("request_elevator")
    data = json.dumps({"from_floor": 0, "to_floor": 1})
    response = client.post(
        url,
        data=data,
        content_type="application/json",
    )
    assert response.status_code == 200
    response_json = json.loads(response.content)
    assert response_json["lift"] in [1, 3]

@pytest.mark.django_db
def test_post_lift_request_fail(client, create_building):
    data = json.dumps({"lift": 1, "floor": 1})
    response = client.post(
        reverse("move_elevator"),
        data=data,
        content_type="application/json",
    )
    assert response.status_code == 200
    response = client.get(reverse("lift_status"))
    assert response.status_code == 200
    assert json.loads(response.content) == {
        "lifts": {
            "1": {"destinations": [], "floor": 1},
            "2": {"destinations": [], "floor": 3},
            "3": {"destinations": [], "floor": 1},
            "4": {"destinations": [], "floor": 0},
        },
    }

    url = reverse("request_elevator")
    data = json.dumps({"from_floor": 0, "to_floor": 3})
    response = client.post(
        url,
        data=data,
        content_type="application/json",
    )
    assert response.status_code == 200
    response_json = json.loads(response.content)
    assert response_json["lift"] in [1, 3]
@pytest.mark.django_db
def test_post_lift_request_to_current_floor(client, create_building):
    # If you request a lift from and to the same floor and the elevator is there just point to that elevator

    url = reverse("request_elevator")
    data = json.dumps({"from_floor": 3, "to_floor": 3})
    response = client.post(
        url,
        data=data,
        content_type="application/json",
    )
    assert response.status_code == 200
    response_json = json.loads(response.content)
    assert response_json["lift"] in [2]

    response = client.get(reverse("lift_status"))
    assert response.status_code == 200
    assert json.loads(response.content) == {
        "lifts": {
            "1": {"destinations": [], "floor": 0},
            "2": {"destinations": [], "floor": 3},
            "3": {"destinations": [], "floor": 1},
            "4": {"destinations": [], "floor": 0},
        },
    }


@pytest.mark.django_db
def test_post_move_elevator(client, create_requests):
    response = client.get(reverse("lift_status"))
    assert response.status_code == 200
    assert json.loads(response.content) == {
        "lifts": {
            "1": {"destinations": [1, 2, 3], "floor": 0},
            "2": {"destinations": [], "floor": 3},
            "3": {"destinations": [], "floor": 1},
            "4": {"destinations": [], "floor": 0},
        },
    }

    data = json.dumps({"lift": 1, "floor": 1})
    response = client.post(
        reverse("move_elevator"),
        data=data,
        content_type="application/json",
    )
    assert response.status_code == 200
    response = client.get(reverse("lift_status"))
    assert response.status_code == 200
    assert json.loads(response.content) == {
        "lifts": {
            "1": {"destinations": [0, 2, 3], "floor": 1},
            "2": {"destinations": [], "floor": 3},
            "3": {"destinations": [], "floor": 1},
            "4": {"destinations": [], "floor": 0},
        },
    }
