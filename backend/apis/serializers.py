#!/usr/bin/env python3
from typing import *

from rest_framework_dataclasses import serializers
from .models import User
from .models import Expertise
from .models import UserExpertise
from .models import BusinessArea

class UserExpertiseSerializer(serializers.DataclassSerializer):
    class Meta:
        dataclass = UserExpertise

class ExpertiseSerializer(serializers.DataclassSerializer):
    class Meta:
        dataclass = Expertise

class BusinessAreaSerializer(serializers.DataclassSerializer):
    class Meta:
        dataclass = BusinessArea

class UserSerializer(serializers.DataclassSerializer):
    class Meta:
        dataclass = User
        exclude = ['password']
