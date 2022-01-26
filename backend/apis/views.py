#!/usr/bin/env python3
from typing import *

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import *
from .models import *


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=True, methods=['get'])
    def get_expertise(self, request, pk=None) -> 'Response[Json[List[UserExperience]]]':
        user: User = self.get_object()
        expertises: QuerySet = user.userexpertise_set.all()
        page = self.paginate_queryset(expertises)

        if page is not None:
            cereal = UserExpertiseSerializer(page, many=True)
            return self.get_paginated_response(cereal.data)
        else:
            cereal = UserExpertiseSerializer(expertises, many=True)
            return Response(cereal.data)


class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer


class ActionPlanViewSet(viewsets.ModelViewSet):
    queryset = ActionPlan.objects.all()
    serializer_class = ActionPlanSerializer
