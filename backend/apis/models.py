#!/usr/bin/env python3
from __future__ import annotations  # This allows us to use type hints of a class inside that class.
from django.db import models
from typing import *
from dataclasses import dataclass
from datetime import datetime

""" This file contains the database models and some associated utilities.
"""


@dataclass(init=False)
class BusinessArea(models.Model):
    """ Database model that stores the business areas that are in the company.

    This can then be searched through during account creation to select your business area, or more
    can be created later on.
    Further, this is also used in the storage of this information - see the User model's
    business_area field.
    """
    name: str = models.CharField(max_length=100, unique=True)


@dataclass(init=False)
class User(models.Model):
    """ Database model that describes a single User.
    """
    first_name: str = models.CharField(max_length=100)
    last_name: str = models.CharField(max_length=100)

    business_area: BusinessArea = models.ForeignKey('BusinessArea',
                                                    null=True,
                                                    on_delete=models.SET_NULL)
    # Users also are experts in a set of fields. See get_expertise below.
    # This is encoded by the UserExpertise model, which relates them together.

    email: str = models.EmailField(max_length=100)
    is_email_verified: bool = models.BooleanField()

    password: str = models.CharField(max_length=100)  # TODO(arwck): Shouldn't be chars.

    mentor: User = models.ForeignKey('User', null=True, on_delete=models.SET_NULL)

    expertise: List[Expertise] = models.ManyToManyField('Expertise')

    def get_mentor_meetings(self) -> QuerySet[List[Meeting]]:
        return self.meeting_mentor.all()

    def get_mentee_meetings(self) -> QuerySet[List[Meeting]]:
        return self.meeting_mentee.all()

    def get_meetings(self) -> QuerySet[List[Meeting]]:
        return self.get_mentor_meetings().union(self.get_mentee_meetings())

    def get_mentee_action_plans(self) -> QuerySet[List[ActionPlan]]:
        return self.actionplan_mentee.all()

    def get_mentor_action_plans(self) -> QuerySet[List[ActionPlan]]:
        return self.actionplan_mentor.all()

    def get_action_plans(self) -> QuerySet[List[ActionPlan]]:
        return self.get_mentor_action_plans().union(self.get_mentee_action_plans())

    def get_mentees(self) -> List[Type[User]]:
        """ Retrieves the list of mentees for this user.
        :return the set of users who have this user as their mentor.
        """
        return self.user_set.all()


@dataclass(init=False)
class Expertise(models.Model):
    """ Database model that holds all the 'kinds' of expertise users may have.

    This can then be searched through during account creation to select your areas of expertise.
    Further, this is also used in the storage of this information - see UserExpertise.
    """
    name: str = models.CharField(max_length=100, unique=True)


@dataclass(init=False)
class Meeting(models.Model):
    mentee: User = models.ForeignKey('User', null=True, related_name='meeting_mentee',
                                     on_delete=models.SET_NULL)  # if the mentee is deleted set mentee to null
    mentor: User = models.ForeignKey('User', null=True, related_name='meeting_mentor',
                                     on_delete=models.SET_NULL)  # if the mentor is deleted set mentor to null
    time: datetime = models.DateTimeField()  # time of meeting


@dataclass(init=False)
class ActionPlan(models.Model):
    name: str = models.CharField(max_length=100)
    description: str = models.CharField(max_length=1000)
    mentee: User = models.ForeignKey('User', related_name='actionplan_mentee',
                                     on_delete=models.CASCADE)  # if the mentee is delete action plans
    mentor: User = models.ForeignKey('User', null=True, related_name='actionplan_mentor',
                                     on_delete=models.SET_NULL)  # if the mentor is deleted set mentor to null
    creation_date: datetime = models.DateTimeField()  # creation date of action plan
    completion_date: datetime = models.DateTimeField(null=True)  # completion date of action plan


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
            print(" | " + f"{u.mentor=}")
    except OperationalError:
        pass
    print(" `-----------------------------------------------------------")


create_dummy_data()
print_all_users()
