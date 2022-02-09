#!/usr/bin/env python3
from typing import *

from django.urls import path
from rest_framework.schemas import get_schema_view

urlpatterns: List[str] = [
    path('schema/', get_schema_view()),
]
