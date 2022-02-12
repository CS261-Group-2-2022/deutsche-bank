#!/usr/bin/env python3
from typing import *

from rest_framework.serializers import ModelSerializer
from .models import *


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        exclude = ['password']


# Register Serializer
class RegisterSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'business_area', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['email'], validated_data['password'],
                                        first_name=validated_data['first_name'], last_name=validated_data['last_name'],
                                        business_area=validated_data['business_area'])
        return user


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
