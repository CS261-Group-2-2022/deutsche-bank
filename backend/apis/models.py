#!/usr/bin/env python3
from __future__ import annotations  # This allows us to use type hints of a class inside that class.

from datetime import datetime

from django.conf import settings
from django.contrib.auth.base_user import AbstractBaseUser
from django.db import models
from django.db.models import QuerySet

from .managers import UserManager

""" This file contains the database models and some associated utilities.
"""


class Skill(models.Model):
    """ Database model that holds all the 'kinds' of expertise users may have.

    This can then be searched through during account creation to select your areas of expertise.
    Further, this is also used in the storage of this information - see UserExpertise.
    """
    name: str = models.CharField(max_length=100, unique=True)


class BusinessArea(models.Model):
    """ Database model that stores the business areas that are in the company.

    This can then be searched through during account creation to select your business area, or more
    can be created later on.
    Further, this is also used in the storage of this information - see the User model's
    business_area field.
    """
    name: str = models.CharField(max_length=100, unique=True)


class Mentorship(models.Model):
    """ Mentorship between mentor and mentee
    """

    mentee: User = models.ForeignKey('User', related_name='mentorship_mentee', on_delete=models.CASCADE)
    mentor: User = models.ForeignKey('User', related_name='mentorship_mentor', on_delete=models.CASCADE)
    rating: int = models.SmallIntegerField(null=True)
    feedback: str = models.CharField(null=True, max_length=1000)

    def get_meetings(self):
        return self.mentorship_meetings.all()

    def get_meeting_requests(self):
        return self.mentorship_meeting_requests.all()


class MentorRequest(models.Model):
    """ Mentorship request from a mentee to a mentor
    """
    mentee: User = models.ForeignKey('User', related_name='request_mentee', on_delete=models.CASCADE)
    mentor: User = models.ForeignKey('User', related_name='request_mentor', on_delete=models.CASCADE)


# TODO: Remove PermissionsMixin if it is not required
class User(AbstractBaseUser):
    """ Database model that describes a single User.
    """
    first_name: str = models.CharField(max_length=100)
    last_name: str = models.CharField(max_length=100)

    business_area: BusinessArea = models.ForeignKey('BusinessArea', null=True, on_delete=models.SET_NULL)

    email: str = models.EmailField(max_length=100, unique=True)  # identifies each user instead of username
    is_email_verified: bool = models.BooleanField(default=False)

    mentorship: Mentorship = models.OneToOneField(Mentorship, null=True, on_delete=models.SET_NULL)
    mentor_intent: bool = models.BooleanField(default=False)  # whether a user wishes to become a mentor

    interests: List[Skill] = models.ManyToManyField(Skill, related_name='user_interests')
    expertise: List[Skill] = models.ManyToManyField(Skill, related_name='user_expertise')

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'business_area']

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        """
        Returns the short name for the user.
        """
        return self.first_name

    def get_mentees(self) -> QuerySet[List[Type[User]]]:
        """ Retrieves the list of mentees for this user.
        :return the set of users who have this user as their mentor.
        """
        return User.objects.all().filter(mentorship__mentor__pk__exact=self.pk)

    def find_group_sessions(self) -> QuerySet[List[GroupSession]]:
        """ Retrieves set of suggested group sessions for this user
        :return: set of suggested group sessions for this user
        """
        # skills__in=self.interests.all() TODO: Skill Matching/Ordering, Filter Out Sessions at Maximum Capacity
        return GroupSession.objects.all().filter(date__gt=datetime.now(tz=settings.TIME_ZONE_INFO)).exclude(
            users__pk__contains=self.pk)

    def get_host_sessions(self) -> QuerySet[List[GroupSession]]:
        """ Retrieves set of hosted group sessions for this user
        :return: set of hosted group sessions for this user
        """
        return self.session_host.all().filter(date__gt=datetime.now(tz=settings.TIME_ZONE_INFO))

    def get_sessions(self):
        """  Retrieves set of group sessions this user is in
        :return: set of group sessions this user is in
        """
        return GroupSession.objects.all().filter(users__pk__contains=self.pk,
                                                 date__gt=datetime.now(tz=settings.TIME_ZONE_INFO))

    def get_action_plans(self):
        return self.user_action_plans.all()


class Meeting(models.Model):
    mentorship: Mentorship = models.ForeignKey(Mentorship, on_delete=models.CASCADE, related_name='mentorship_meetings')
    time: datetime = models.DateTimeField()  # time of meeting
    notes: str = models.CharField(max_length=1000)


class MeetingRequest(models.Model):
    mentorship: Mentorship = models.ForeignKey(Mentorship, on_delete=models.CASCADE,
                                               related_name='mentorship_meeting_requests')
    time: datetime = models.DateTimeField()  # time of meeting


class ActionPlan(models.Model):
    name: str = models.CharField(max_length=100)
    description: str = models.CharField(max_length=1000)
    user: User = models.ForeignKey(User, on_delete=models.CASCADE,
                                   related_name="user_action_plans")  # if the user is deleted action plans
    creation_date: datetime = models.DateTimeField(auto_now_add=True)  # creation date of action plan
    completion_date: datetime = models.DateTimeField(null=True)  # completion date of action plan


class Notification(models.Model):
    user: User = models.ForeignKey(User, on_delete=models.CASCADE)
    name: str = models.CharField(max_length=100)
    description: str = models.CharField(max_length=1000)
    date: datetime = models.DateTimeField(auto_now_add=True)
    actioned: bool = models.BooleanField()  # user has acted on notification


class GroupSession(models.Model):
    name: str = models.CharField(max_length=100)
    location: str = models.CharField(null=True, max_length=100)
    virtual_link: str = models.CharField(null=True, max_length=100)
    image_link: str = models.CharField(null=True, max_length=100)
    description: str = models.CharField(null=True, max_length=2000)
    host: User = models.ForeignKey(User, related_name='session_host',
                                   on_delete=models.CASCADE)  # if host is deleted, delete session
    capacity: int = models.IntegerField(null=True)
    skills: List[Skill] = models.ManyToManyField(Skill)
    date: datetime = models.DateTimeField()
    users: List[User] = models.ManyToManyField(User, default=[])


class Feedback(models.Model):
    date: datetime = models.DateTimeField()
    feedback: str = models.CharField(max_length=1000)


from .dummy_data import *


def print_all_users() -> None:
    print(" ,-----------------------------------------------------------")
    print(" | " + " Printing all users...")
    try:
        for u in User.objects.all().iterator():
            print(" | ---------------------------------------------------- ")
            print(" | " + str(u))
            print(f" | {u.pk=}")
            print(f" | {u.id=}")
            print(" | " + u.first_name)
            print(" | " + 'None' if u.mentorship is None else f'{u.mentorship.mentor}')
    except OperationalError:
        pass
    print(" `-----------------------------------------------------------")

# create_dummy_data()
# print_all_users()
