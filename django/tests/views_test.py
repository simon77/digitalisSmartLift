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
        "numberOfLifts": 3,
    }


@pytest.mark.django_db
def test_get_lift_config(client, create_building):
    url = reverse("lift_config")
    response = client.get(url)
    assert response.status_code == 200
    assert json.loads(response.content) == {
        "lifts": {
            "1": {"serviced_floors": [0, 1, 2]},
            "2": {"serviced_floors": [0, 1]},
            "3": {"serviced_floors": [0, 2]},
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
            "2": {"destinations": [], "floor": 0},
            "3": {"destinations": [], "floor": 0},
        }
    }


@pytest.mark.django_db
def test_get_lift_status(client, create_requests):
    url = reverse("lift_status")
    response = client.get(url)
    assert response.status_code == 200
    assert json.loads(response.content) == {
        "lifts": {
            "1": {"destinations": [0, 1], "floor": 0},
            "2": {"destinations": [], "floor": 0},
            "3": {"destinations": [], "floor": 0},
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
    assert response_json["lift"] in [1, 2]


@pytest.mark.django_db
def test_post_move_elevator(client, create_requests):
    response = client.get(reverse("lift_status"))
    assert response.status_code == 200
    assert json.loads(response.content) == {
        "lifts": {
            "1": {"destinations": [0, 1], "floor": 0},
            "2": {"destinations": [], "floor": 0},
            "3": {"destinations": [], "floor": 0},
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
            "1": {"destinations": [], "floor": 1},
            "2": {"destinations": [], "floor": 0},
            "3": {"destinations": [], "floor": 0},
        },
    }
