# -*- coding: utf-8 -*-
"""
Django admin interface for smartlift

"""
from django.contrib import admin

from .models import Floor, Lift, ServicedFloor

admin.site.register(Lift)
admin.site.register(Floor)
admin.site.register(ServicedFloor)
