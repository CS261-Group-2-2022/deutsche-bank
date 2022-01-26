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
    def expertise(self, request, pk=None) -> 'Response[Json[List[Expertise]]]':
        user: User = self.get_object()

        cereal = ExpertiseSerializer(user.expertise.all(), many=True)
        return Response(cereal.data)


class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer


class ActionPlanViewSet(viewsets.ModelViewSet):
    queryset = ActionPlan.objects.all()
    serializer_class = ActionPlanSerializer
