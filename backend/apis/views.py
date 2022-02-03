#!/usr/bin/env python3
from typing import *

from django.db.models import QuerySet
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import *
from .models import *


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=True, methods=['get'])
    def full(self, request, pk=None):
        return Response(FullUserSerializer(self.get_object()).data)

    @action(detail=True, methods=['get'])
    def mentees(self, request, pk=None) -> List[User]:
        user: User = self.get_object()

        cereal = UserSerializer(user.get_mentees(), many=True)
        return Response(cereal.data)

    @action(detail=True, methods=['get'])
    def expertise(self, request, pk=None) -> List[Skill]:
        user: User = self.get_object()

        cereal = SkillSerializer(user.expertise.all(), many=True)
        return Response(cereal.data)

    @action(detail=True, methods=['get'])
    def meetings(self, request, pk=None) -> List[Meeting]:
        user: User = self.get_object()

        cereal = MeetingSerializer(user.get_meetings(), many=True)
        return Response(cereal.data)

    @action(detail=True, methods=['get'])
    def mentor_meetings(self, request, pk=None) -> List[Meeting]:
        user: User = self.get_object()

        cereal = MeetingSerializer(user.get_mentor_meetings(), many=True)
        return Response(cereal.data)

    @action(detail=True, methods=['get'])
    def mentee_meetings(self, request, pk=None) -> List[Meeting]:
        user: User = self.get_object()

        cereal = MeetingSerializer(user.get_mentee_meetings(), many=True)
        return Response(cereal.data)

    @action(detail=True, methods=['get'])
    def mentee_plan(self, request, pk=None) -> List[ActionPlan]:
        user: User = self.get_object()

        cereal = ActionPlanSerializer(user.get_mentee_action_plans(), many=True)
        return Response(cereal.data)

    @action(detail=True, methods=['get'])
    def mentor_plan(self, request, pk=None) -> List[ActionPlan]:
        user: User = self.get_object()

        cereal = ActionPlanSerializer(user.get_mentor_action_plans(), many=True)
        return Response(cereal.data)

    @action(detail=True, methods=['get'])
    def plan(self, request, pk=None) -> List[ActionPlan]:
        user: User = self.get_object()

        cereal = ActionPlanSerializer(user.get_action_plans(), many=True)
        return Response(cereal.data)


class GroupSessionViewSet(viewsets.ModelViewSet):
    queryset = GroupSession.objects.all()
    serializer_class = GroupSessionSerializer


class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer


class ActionPlanViewSet(viewsets.ModelViewSet):
    queryset = ActionPlan.objects.all()
    serializer_class = ActionPlanSerializer
