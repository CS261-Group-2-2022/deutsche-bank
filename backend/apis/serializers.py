#!/usr/bin/env python3
from collections import OrderedDict

from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, Serializer

from .models import *


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        exclude = ('password',)


class UserSerializerFull(UserSerializer):
    action_plans = serializers.SerializerMethodField()

    class Meta(UserSerializer.Meta):
        depth = 1

    def get_action_plans(self, obj: User):
        return ActionPlanSerializer(obj.get_action_plans(), many=True).data


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
            'password': {'write_only': True, 'style': {'input_type': 'password'}},
            'trim_whitespace': False
        }

    def validate(self, attrs: OrderedDict):
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(request=self.context.get('request'), username=email, password=password)

        if not user:
            msg = 'Unable to log in with provided credentials.'
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs


class PasswordLoginSerializer(LoginSerializer):
    class Meta(LoginSerializer.Meta):
        fields = ('password',)

    def validate(self, attrs: OrderedDict):
        user: User = self.context.get('request').user

        password: str = attrs.get('password')
        if not authenticate(request=self.context.get('request'), username=user.email, password=password):
            raise serializers.ValidationError('This password is not correct', code='authorization')

        return attrs


class ChangePasswordSerializer(PasswordLoginSerializer):
    new_password = serializers.CharField(max_length=255)

    class Meta(PasswordLoginSerializer.Meta):
        fields = ('password', 'new_password')
        extra_kwargs = {
            'password': {'write_only': True, 'style': {'input_type': 'password'}},
            'new_password': {'write_only': True, 'style': {'input_type': 'password'}},
            'trim_whitespace': False
        }


class MentorshipSerializer(ModelSerializer):
    meetings = serializers.SerializerMethodField()
    meeting_requests = serializers.SerializerMethodField()
    mentor_feedback = serializers.SerializerMethodField()  # Feedback given by the mentor to the mentee

    class Meta:
        model = Mentorship
        exclude = []

    def get_meetings(self, obj: Mentorship):
        return MeetingSerializer(obj.get_meetings(), many=True).data

    def get_meeting_requests(self, obj: Mentorship):
        return MeetingRequestSerializer(obj.get_meeting_requests(), many=True).data

    def get_mentor_feedback(self, obj: Mentorship):
        return MentorFeedbackSerializer(obj.get_mentor_feedback(), many=True).data


class MentorshipSerializerFull(MentorshipSerializer):
    mentor = UserSerializer()
    mentee = UserSerializer()


class MentorRequestSerializer(ModelSerializer):
    class Meta:
        model = MentorRequest
        exclude = []
        extra_kwargs = {
            'mentee': {'read_only': True}
        }


class MentorRequestMentorSerializer(MentorRequestSerializer):
    mentor = UserSerializer()

    class Meta(MentorRequestSerializer.Meta):
        include = ['mentor']


class MentorRequestMenteeSerializer(MentorRequestSerializer):
    mentee = UserSerializer()

    class Meta(MentorRequestSerializer.Meta):
        include = ['mentee']


class MentorFeedbackSerializer(ModelSerializer):
    class Meta:
        model = MentorFeedback
        exclude = []
        extra_kwargs = {
            'time': {'read_only': True}
        }


class MeetingSerializer(ModelSerializer):
    class Meta:
        model = Meeting
        exclude = []
        extra_kwargs = {
            'location': {'required': False},
            'mentee_notes': {'required': False},
            'mentor_notes': {'required': False}
        }


class MeetingSerializerFull2(MeetingSerializer):
    mentorship = MentorshipSerializerFull()

    class Meta(MeetingSerializer.Meta):
        depth = 2


class MeetingRequestSerializer(ModelSerializer):
    class Meta:
        model = MeetingRequest
        exclude = []
        extra_kwargs = {
            'location': {'required': False},
            'mentorship': {'read_only': True}
        }


class ActionPlanSerializer(ModelSerializer):
    class Meta:
        model = ActionPlan
        exclude = []
        extra_kwargs = {
            'user': {'required': False},
            'description': {'required': False},
            'completion_date': {'required': False},
            'creation_date': {'read_only': True}
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
    host = UserSerializer()
    users = UserSerializer(many=True)

    class Meta(GroupSessionSerializer.Meta):
        depth = 1


class FeedbackSerializer(ModelSerializer):
    class Meta:
        model = Feedback
        exclude = []


class NotificationSerializer(ModelSerializer):
    class Meta:
        model = Notification
