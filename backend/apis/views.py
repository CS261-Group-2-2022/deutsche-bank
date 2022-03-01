#!/usr/bin/env python3
from typing import *

from pprint import pprint
from django.contrib.auth import login
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView
from rest_framework import viewsets, generics, permissions, status, mixins
from rest_framework.decorators import action
from rest_framework.exceptions import APIException
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from .models import *
from .serializers import *
from .dummy_data import create_dummy_data

from .matching_algorithm import matching_algorithm

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    @action(detail=False, methods=['get'])
    def mentor(self, request, *args, **kwargs):
        user: User = request.user
        mentorship: Mentorship = user.mentorship
        if mentorship is None:
            return Response({'error': 'This user does not have a mentor'}, status=status.HTTP_204_NO_CONTENT)

        return Response(UserSerializerFull(user.mentorship.mentor))

    @action(detail=True, methods=['get'])
    def reset(self, request, pk=None):
        #clear_database()
        create_dummy_data()
        return Response("Reset database.")

    @action(detail=True, methods=['get'])
    def matching(self, request, pk=None):
        user: User = self.get_object()
        all_users: List[User] = list(User.objects.all())
        users_who_want_to_mentor: List[User] = list(User.objects.all().filter(mentor_intent=True))
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
        return Response(UserSerializerFull(self.get_object()).data)

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
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)  # Serialize current user
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        instance = request.user
        serializer = UserSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

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

    @action(detail=True, methods=['post'])
    def end(self, request, *args, **kwargs):  # Terminates a mentorship
        mentorship: Mentorship = self.get_object()
        user: User = request.user
        mentee: User = mentorship.mentee
        if user is not mentorship.mentor or user is not mentorship.mentee:
            return Response({'error': 'You cannot end this mentorship'}, status=status.HTTP_400_BAD_REQUEST)
        if mentee.mentorship.pk is not mentorship.pk:
            return Response({'error': 'This mentorship is not active'}, status=status.HTTP_400_BAD_REQUEST)
        mentee.mentorship = None
        mentee.save()
        return Response(status=status.HTTP_200_OK)


class MentorRequestViewSet(viewsets.ModelViewSet):
    queryset = MentorRequest.objects.all()
    serializer_class = MentorRequestSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        """
        Creates a mentorship request for the currently authenticated user
        :return: Serialized meeting request
        """
        serializer = self.get_serializer(data=request.data)
        if request.user.mentorship:  # If the user already has a mentor respond with an error
            return Response({'error': 'You already have a mentor'}, status=status.HTTP_400_BAD_REQUEST)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['mentee'] = request.user
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['post'])
    def cancel(self, request, *args, **kwargs):  # Cancels a meeting request
        request: MeetingRequest = self.get_object()
        user: User = request.user
        if request.mentorship.mentee is not user:
            return Response({'error': 'You cannot cancel this meeting'}, status=status.HTTP_400_BAD_REQUEST)
        request.delete()

        return Response(status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def accept(self, request, *args, **kwargs):  # Accepts a meeting request, creating a meeting
        meeting_request: MeetingRequest = self.get_object()
        user: User = request.user
        if meeting_request.mentorship.mentor is not user:
            return Response({'error': 'You cannot cancel this meeting'}, status=status.HTTP_400_BAD_REQUEST)
        meeting_request.delete()
        meeting: Meeting = Meeting(mentorship=meeting_request.mentorship, time=meeting_request.time)
        meeting.save()

        return Response(data=MeetingSerializer(meeting).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def decline(self, request, *args, **kwargs):  # Declines a meeting request
        meeting_request: MeetingRequest = self.get_object()
        user: User = request.user
        if meeting_request.mentorship.mentor is not user:
            return Response({'error': 'You cannot cancel this meeting'}, status=status.HTTP_400_BAD_REQUEST)

        # TODO: Finish implementation
        return Response(status=status.HTTP_200_OK)


class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer


class MeetingRequestViewSet(viewsets.ModelViewSet):
    queryset = MeetingRequest.objects.all()
    serializer_class = MeetingRequestSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        """
        Creates a meeting request for the currently authenticated user
        :return: Serialized meeting request
        """
        serializer = self.get_serializer(data=request.data)
        if not request.user.mentorship:  # If the user doesn't have a mentor respond with an error
            return Response({'error': 'You do not have a mentor'}, status=status.HTTP_400_BAD_REQUEST)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['mentorship'] = request.user.mentorship
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


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

    def list(self, request, *args, **kwargs):
        return Response(ActionPlanSerializer(request.user.get_action_plans(), many=True), status=status.HTTP_200_OK)


class BusinessAreaViewSet(viewsets.ModelViewSet):
    # TODO(akiss) If the front-end provides a token that is invalid, these endpoints still do not work.
    # This is an issue when creating an account while 'remember me' is active.
    permission_classes = (permissions.AllowAny,)  # User does not need to be authenticated to login
    queryset = BusinessArea.objects.all()
    serializer_class = BusinessAreaSerializer


class SkillViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)  # User does not need to be authenticated to login
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
