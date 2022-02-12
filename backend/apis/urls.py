#!/usr/bin/env python3
from typing import *

from django.urls import include, path
from knox.views import LogoutView, LogoutAllView
from rest_framework import routers
from .views import *

router: routers.DefaultRouter = routers.DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'meeting', MeetingViewSet)
router.register(r'mentorship', MentorshipViewSet)
router.register(r'plan', ActionPlanViewSet)
router.register(r'session', GroupSessionViewSet)

urlpatterns: List[str] = [
    path('', include(router.urls)),

    path(r'auth/register/', RegisterView.as_view(), name='register'),
    path(r'auth/login/', LoginView.as_view(), name='login'),
    path(r'auth/logout/', LogoutView.as_view(), name='logout'),
    path(r'auth/logoutall/', LogoutAllView.as_view(), name='logoutall')
]
