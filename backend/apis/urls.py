#!/usr/bin/env python3

from django.urls import include, path
from knox.views import LogoutView, LogoutAllView
from rest_framework import routers

from .views import *

router: routers.DefaultRouter = routers.DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'meeting', MeetingViewSet)
router.register(r'meeting-request', MeetingRequestViewSet)
router.register(r'mentorship', MentorshipViewSet)
router.register(r'mentorship-request', MentorRequestViewSet)
router.register(r'mentorship-feedback', MentorFeedbackViewSet)
router.register(r'plan', ActionPlanViewSet)
router.register(r'session', GroupSessionViewSet)
router.register(r'area', BusinessAreaViewSet)
router.register(r'skills', SkillViewSet)
router.register(r'feedback', FeedbackViewSet)
router.register(r'notification', NotificationViewSet)

urlpatterns: List[str] = [
    path('', include(router.urls)),

    path(r'events/', EventsView.as_view(), name='events'),  # Gets upcoming events

    path(r'auth/profile/', CurrentUserView.as_view(), name='profile'),  # Gets current user
    path(r'auth/register/', RegisterView.as_view(), name='register'),  # Creates user and token
    path(r'auth/password/', ChangePasswordView.as_view(), name='password'),  # Changes user password
    path(r'auth/login/', LoginView.as_view(), name='login'),  # Creates token
    path(r'auth/logout/', LogoutView.as_view(), name='logout'),  # Deletes single token
    path(r'auth/logoutall/', LogoutAllView.as_view(), name='logoutall')  # Deletes all tokens associated with user
]
