#!/usr/bin/env python3
from typing import *

from django.urls import include, path
from rest_framework import routers
from .views import *

router : routers.DefaultRouter = routers.DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns : List[str] = [
    path('', include(router.urls)),
]
