#!/usr/bin/env python3
from typing import *

from rest_framework.serializers import ModelSerializer
from .models import User, Meeting, ActionPlan, Expertise, UserExpertise, BusinessArea


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


class UserExpertiseSerializer(ModelSerializer):
    class Meta:
        model = UserExpertise
        exclude = []


class ExpertiseSerializer(ModelSerializer):
    class Meta:
        model = Expertise
        exclude = []


class BusinessAreaSerializer(ModelSerializer):
    class Meta:
        model = BusinessArea
        exclude = []

