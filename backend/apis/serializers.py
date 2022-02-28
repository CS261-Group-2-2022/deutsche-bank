#!/usr/bin/env python3

from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, Serializer

from .models import *


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        exclude = ['password']


class RegisterSerializer(ModelSerializer):
    """
    Serializes data sent to register a new user
    """

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'business_area', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['email'], validated_data['password'],
                                        first_name=validated_data['first_name'], last_name=validated_data['last_name'],
                                        business_area=validated_data['business_area'])
        return user


class LoginSerializer(ModelSerializer):
    """
    Serializes data sent to login a user

    Email and password are inputted and a token is outputted
    """
    token = serializers.CharField(label="Token", read_only=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'token')
        extra_kwargs = {
            'email': {'write_only': True, 'validators': []},
            'password': {'write_only': True, 'style': {'input_type': 'password'}}, 'trim_whitespace': False
        }

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(request=self.context.get('request'), username=email, password=password)

        if not user:
            msg = 'Unable to log in with provided credentials.'
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs


class MeetingSerializer(ModelSerializer):
    class Meta:
        model = Meeting
        exclude = []


class MeetingRequestSerializer(ModelSerializer):
    class Meta:
        model = MeetingRequest
        exclude = []
        extra_kwargs = {
            'mentorship': {'read_only': True}
        }


class ActionPlanSerializer(ModelSerializer):
    class Meta:
        model = ActionPlan
        exclude = []
        extra_kwargs = {
            'user': {'required': False}
        }


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
        extra_kwargs = {
            'description': {'required': False},
            'virtual_link': {'required': False},
            'image_link': {'required': False},
            'host': {'read_only': True},
            'users': {'read_only': True}
        }


class GroupSessionSerializerFull(GroupSessionSerializer):
    class Meta(GroupSessionSerializer.Meta):
        depth = 1


class MentorshipSerializer(ModelSerializer):
    meetings = serializers.SerializerMethodField()
    meeting_requests = serializers.SerializerMethodField()

    class Meta:
        model = Mentorship
        exclude = []

    def get_meetings(self, obj: Mentorship):
        return MeetingSerializer(obj.get_meetings(), many=True).data

    def get_meeting_requests(self, obj: Mentorship):
        return MeetingRequestSerializer(obj.get_meeting_requests(), many=True).data


class MentorRequestSerializer(ModelSerializer):
    class Meta:
        model = MentorRequest
        exclude = []
        extra_kwargs = {
            'mentee': {'read_only': True}
        }


class UserSerializerFull(UserSerializer):
    action_plans = serializers.SerializerMethodField()

    class Meta(UserSerializer.Meta):
        depth = 1

    def get_action_plans(self, obj: User):
        return ActionPlanSerializer(obj.get_action_plans(), many=True).data
