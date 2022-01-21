#!/usr/bin/env python3
from typing import *

from rest_framework import viewsets

from .serializers import StuffSerializer
from .models import StuffModel

class StuffViewSet(viewsets.ModelViewSet):
    queryset = StuffModel.objects.all()
    serializer_class = StuffSerializer

class FirstStuffViewSet(viewsets.ModelViewSet):
    queryset = StuffModel.objects.all()
    serializer_class = StuffSerializer
