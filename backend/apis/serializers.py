#!/usr/bin/env python3

from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

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
        extra_kwargs = {
            'description': {'required': False},
            'host': {'read_only': True},
            'users': {'read_only': True}
        }


class GroupSessionSerializerFull(GroupSessionSerializer):
    host = UserSerializer()
    users = UserSerializer(many=True)
    skills = SkillSerializer(many=True)


class MentorshipSerializer(ModelSerializer):
    class Meta:
        model = Mentorship
        exclude = []


class UserSerializerFull(UserSerializer):
    business_area = BusinessAreaSerializer()
    expertise = SkillSerializer(many=True)
    mentorship = MentorshipSerializer()
