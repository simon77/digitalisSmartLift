from django.urls import path

from . import views

urlpatterns = [
    path("lift/config", views.get_lift_config, name="lift_config"),
    path("lift/status", views.get_lift_status, name="lift_status"),
    path("lift/request", views.request_elevator, name="request_elevator"),
    path("lift/move", views.move_elevator, name="move_elevator"),
    path("building/config", views.get_building_config, name="building_config"),
]
