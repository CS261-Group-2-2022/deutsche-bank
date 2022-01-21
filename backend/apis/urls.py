#!/usr/bin/env python3
from typing import *

from django.urls import include, path
from rest_framework import routers
from .views import *


router : routers.DefaultRouter = routers.DefaultRouter()
router.register(r'stuff', StuffViewSet)
router.register(r'stuff/first', FirstStuffViewSet)

urlpatterns : List[str] = [
    path('', include(router.urls)),
]
