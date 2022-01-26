#!/usr/bin/env python3
from typing import *

from rest_framework.serializers import ModelSerializer
from .models import User, Meeting, ActionPlan


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        exclude = ['password']


class MeetingSerializer(ModelSerializer):
    class Meta:
        model = Meeting
        exclude = []


class ActionPlanSerializer(ModelSerializer):
    class Meta:
        model = ActionPlan
        exclude = []
