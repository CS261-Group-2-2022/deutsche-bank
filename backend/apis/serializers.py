#!/usr/bin/env python3
from typing import *

from rest_framework import serializers

from .models import StuffModel

class StuffSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = StuffModel
        fields : List[str] = ['title']
