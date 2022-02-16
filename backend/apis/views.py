#!/usr/bin/env python3

from django.contrib.auth import login
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView
from rest_framework import viewsets, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import *


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    # permission_classes = (IsAuthenticated,)

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

    @action(detail=True, methods=['get'])
    def mentees(self, request, pk=None) -> List[ActionPlan]:
        user: User = self.get_object()
        cereal = UserSerializer(user.get_mentees(), many=True)
        return Response(cereal.data)


class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)  # Deserialize request data
        serializer.is_valid(raise_exception=True)  # Validate request data
        user = serializer.save()  # Get user instance
        return Response(
            {
                "user": UserSerializer(user, context=self.get_serializer_context()).data,  # Serialize user
                "token": AuthToken.objects.create(user)[1]  # Create token
            }
        )


class LoginView(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)  # User does not need to be authenticated to login
    serializer_class = LoginSerializer  # Force DjangoRESTFramework to use this serializer

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)  # Deserialize request data
        serializer.is_valid(raise_exception=True)  # Validate request data
        user = serializer.validated_data['user']  # Get user from serializer
        login(request, user)  # Login user object
        return super(LoginView, self).post(request, format=None)  # Create auth token


class CurrentUserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)  # User must be authenticated to get user

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)  # Serialize current user
        return Response(serializer.data)


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


class BusinessAreaViewSet(viewsets.ModelViewSet):
    queryset = BusinessArea.objects.all()
    serializer_class = BusinessAreaSerializer
