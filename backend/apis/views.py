#!/usr/bin/env python3
from typing import *

from django.db.models import QuerySet
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import *
from .models import *

from .matching_algorithm import matching_algorithm


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=True, methods=['get'])
    def matching(self, request, pk=None):
        user: User = self.get_object()
        all_users: List[User] = list(User.objects.all())
        users_who_want_to_mentor: List[User] = list(User.objects.all().filter(mentor_intent=true))
        all_mentorships: List[Mentorship] = list(Mentorship.objects.all())
        current_mentorships: List[Mentorship] = list(Mentorship.objects.all())
        all_requests: List[Request] = list(Request.objects.all())

        potential_mentors: List[User] = matching_algorithm(user,
                                                           all_users,
                                                           users_who_want_to_mentor,
                                                           all_mentorships,
                                                           current_mentorships,
                                                           all_requests)

        cereal = UserSerializer(potential_mentors, many=True)

        return Response(cereal.data)

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

class MentorshipViewSet(viewsets.ModelViewSet):
    queryset = Mentorship.objects.all()
    serializer_class = MentorshipSerializer

class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer

class ActionPlanViewSet(viewsets.ModelViewSet):
    queryset = ActionPlan.objects.all()
    serializer_class = ActionPlanSerializer
