#!/usr/bin/env python3
from typing import *

from rest_framework_dataclasses import serializers
from .models import User

class UserSerializer(serializers.DataclassSerializer):
    class Meta:
        dataclass = User
        exclude = ['password']
