#!/usr/bin/env python3
from typing import *

from rest_framework.serializers import ModelSerializer
from .models import *


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


class SkillSerializer(ModelSerializer):
    class Meta:
        model = Skill
        exclude = []


class BusinessAreaSerializer(ModelSerializer):
    class Meta:
        model = BusinessArea
        exclude = []


class GroupSessionSerializer(ModelSerializer):
    class Meta:
        model = GroupSession
        exclude = []


class MentorshipSerializer(ModelSerializer):
    class Meta:
        model = Mentorship
        exclude = []


class FullUserSerializer(UserSerializer):
    business_area = BusinessAreaSerializer()
    expertise = SkillSerializer(many=True)
    mentorship = MentorshipSerializer()
