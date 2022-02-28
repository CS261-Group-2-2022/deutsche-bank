#!/usr/bin/env python3

from django.contrib.auth import login
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import APIException
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import *
from .serializers import *


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    # permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=['get'])
    def mentor(self, request, *args, **kwargs):
        user: User = request.user
        mentorship: Mentorship = user.mentorship
        if mentorship is None:
            return Response({'error': 'This user does not have a mentor'}, status=status.HTTP_204_NO_CONTENT)

        return Response(UserSerializerFull(user.mentorship.mentor))

    @action(detail=False, methods=['get'])
    def mentees(self, request, *args, **kwargs) -> Response:
        user: User = request.user

        cereal = UserSerializerFull(user.get_mentees(), many=True)
        return Response(cereal.data)

    @action(detail=True, methods=['get'])
    def full(self, request, pk=None) -> Response:
        return Response(UserSerializerFull(self.get_object()).data)

    @action(detail=True, methods=['get'])
    def expertise(self, request, pk=None) -> Response:
        user: User = self.get_object()

        cereal = SkillSerializer(user.expertise.all(), many=True)
        return Response(cereal.data)


class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)  # Deserialize request data
        serializer.is_valid(raise_exception=True)  # Validate request data
        user = serializer.save()  # Get user instance
        return Response(
            {
                "user": UserSerializerFull(user, context=self.get_serializer_context()).data,  # Serialize user
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
    permission_classes = (permissions.IsAuthenticated,)  # User must be authenticated to manage group sessions

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.validated_data['host'] = request.user
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs) -> Response:
        queryset = GroupSession.objects.all()
        serializer = GroupSessionSerializerFull(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def user(self, request, *args, **kwargs) -> Response:  # Retrieves set of group sessions this user is in
        user: User = request.user
        return Response(GroupSessionSerializerFull(user.get_sessions(), many=True).data)

    @action(detail=False, methods=['get'])
    def host(self, request, *args, **kwargse) -> Response:  # Retrieves set of hosted group sessions for this user
        user: User = request.user
        return Response(GroupSessionSerializerFull(user.get_host_sessions(), many=True).data)

    @action(detail=False, methods=['get'])
    def find(self, request, *args, **kwargs) -> Response:  # Retrieves set of suggested group sessions for this user
        user: User = request.user
        return Response(GroupSessionSerializerFull(user.find_group_sessions(), many=True).data)

    @action(detail=True, methods=['post'])
    def join(self, request, *args, **kwargs):  # Joins the session
        session: GroupSession = self.get_object()
        user: User = request.user
        if user.get_sessions().filter(pk=session.pk).exists():
            return Response({'error': 'You are already in this session'}, status=status.HTTP_400_BAD_REQUEST)
        if user.get_host_sessions().filter(pk=session.pk).exists():
            return Response({'error': 'You are hosting this session'}, status=status.HTTP_400_BAD_REQUEST)
        if session.users.count() >= session.capacity:
            return Response({'error': 'This session is full'}, status=status.HTTP_400_BAD_REQUEST)

        session.users.add(user)
        user.save()
        return Response(GroupSessionSerializer(session).data)

    @action(detail=True, methods=['post'])
    def leave(self, request, *args, **kwargs):  # Leaves the session
        session: GroupSession = self.get_object()
        user: User = request.user
        if not user.get_sessions().filter(pk=session.pk).exists():
            return Response({'error': 'User is not in session'}, status=status.HTTP_400_BAD_REQUEST)

        session.users.remove(user)
        user.save()
        return Response(GroupSessionSerializer(session).data)


class MentorshipViewSet(viewsets.ModelViewSet):
    queryset = Mentorship.objects.all()
    serializer_class = MentorshipSerializer


class MentorRequestViewSet(viewsets.ModelViewSet):
    queryset = MentorRequest.objects.all()
    serializer_class = MentorRequest


class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer


class MeetingRequestViewSet(viewsets.ModelViewSet):
    queryset = MeetingRequest.objects.all()
    serializer_class = MeetingRequestSerializer


class ActionPlanViewSet(viewsets.ModelViewSet):
    queryset = ActionPlan.objects.all()
    serializer_class = ActionPlanSerializer
    permission_classes = (permissions.IsAuthenticated,)  # User must be authenticated to manage action plans

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if 'user' not in serializer.validated_data:
            serializer.validated_data['user'] = request.user
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class BusinessAreaViewSet(viewsets.ModelViewSet):
    queryset = BusinessArea.objects.all()
    serializer_class = BusinessAreaSerializer


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
