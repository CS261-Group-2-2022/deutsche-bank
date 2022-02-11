#!/usr/bin/env python3
from __future__ import annotations  # This allows us to use type hints of a class inside that class.

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from typing import *
from dataclasses import dataclass
from datetime import datetime

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

    mentee: User = models.ForeignKey('User', related_name='relationship_mentee', on_delete=models.CASCADE)
    mentor: User = models.ForeignKey('User', related_name='relationship_mentor', on_delete=models.CASCADE)
    rating: int = models.SmallIntegerField(null=True)
    feedback: str = models.CharField(null=True, max_length=1000)


class Request(models.Model):
    """ Mentorship request from a mentee to a mentor
    """
    mentee: User = models.ForeignKey('User', related_name='request_mentee', on_delete=models.CASCADE)
    mentor: User = models.ForeignKey('User', related_name='request_mentor', on_delete=models.CASCADE)


class User(AbstractBaseUser, PermissionsMixin):
    """ Database model that describes a single User.
    """
    first_name: str = models.CharField(max_length=100)
    last_name: str = models.CharField(max_length=100)

    business_area: BusinessArea = models.ForeignKey('BusinessArea', null=True, on_delete=models.SET_NULL)

    email: str = models.EmailField(max_length=100,unique=True)
    is_email_verified: bool = models.BooleanField()

    # password: str = models.CharField(max_length=100)  # TODO(arwck): Shouldn't be chars.

    mentorship: Mentorship = models.OneToOneField(Mentorship, null=True, on_delete=models.SET_NULL)
    mentor_intent: bool = models.BooleanField(default=False)  # whether a user wishes to become a mentor

    interests: List[Skill] = models.ManyToManyField(Skill, related_name='user_interests')
    expertise: List[Skill] = models.ManyToManyField(Skill, related_name='user_expertise')

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

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

    def get_mentor_meetings(self) -> QuerySet[List[Meeting]]:
        return self.meeting_mentor.all()

    def get_mentee_meetings(self) -> QuerySet[List[Meeting]]:
        return self.meeting_mentee.all()

    def get_meetings(self) -> QuerySet[List[Meeting]]:
        return self.get_mentor_meetings().union(self.get_mentee_meetings())

    def get_mentee_action_plans(self) -> QuerySet[List[ActionPlan]]:
        return self.actionplan_user.all()

    def get_mentor_action_plans(self) -> QuerySet[List[ActionPlan]]:
        return self.actionplan_mentor.all()

    def get_action_plans(self) -> QuerySet[List[ActionPlan]]:
        return self.get_mentor_action_plans().union(self.get_mentee_action_plans())

    def get_mentees(self) -> QuerySet[List[Type[User]]]:
        """ Retrieves the list of mentees for this user.
        :return the set of users who have this user as their mentor.
        """
        return User.objects.all().filter(mentorship__mentor__pk__exact=self.pk).exclude(pk__exact=self.pk)


class Meeting(models.Model):
    mentorship: Mentorship = models.ForeignKey(Mentorship, on_delete=models.CASCADE)
    time: datetime = models.DateTimeField()  # time of meeting
    notes: str = models.CharField(max_length=1000)


class ActionPlan(models.Model):
    name: str = models.CharField(max_length=100)
    description: str = models.CharField(max_length=1000)
    user: User = models.ForeignKey(User, on_delete=models.CASCADE)  # if the user is deleted action plans
    creation_date: datetime = models.DateTimeField()  # creation date of action plan
    completion_date: datetime = models.DateTimeField(null=True)  # completion date of action plan


class Notification(models.Model):
    user: User = models.ForeignKey(User, on_delete=models.CASCADE)
    name: str = models.CharField(max_length=100)
    description: str = models.CharField(max_length=1000)
    date: datetime = models.DateTimeField()
    actioned: bool = models.BooleanField()  # user has acted on notification


class GroupSession(models.Model):
    name: str = models.CharField(max_length=100)
    location: str = models.CharField(null=True, max_length=100)
    description: str = models.CharField(null=True, max_length=500)
    host: User = models.ForeignKey(User, related_name='session_host',
                                   on_delete=models.CASCADE)  # if host is deleted, delete session
    capacity: int = models.IntegerField(null=True)
    skills: List[Skill] = models.ManyToManyField(Skill)
    date: datetime = models.DateTimeField()
    users: List[User] = models.ManyToManyField(User)


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


#create_dummy_data()
#print_all_users()
