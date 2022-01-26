#!/usr/bin/env python3
from __future__ import annotations  # This allows us to use type hints of a class inside that class.
from django.db import models, OperationalError
from typing import *
from dataclasses import dataclass
from datetime import datetime


@dataclass(init=False)
class User(models.Model):
    first_name: str = models.CharField(max_length=100)
    last_name: str = models.CharField(max_length=100)

    # TODO(arwck): Figure out how emailfield works
    email: str = models.EmailField(max_length=100)
    is_email_verified: bool = models.BooleanField()

    password: str = models.CharField(max_length=100)  # TODO(arwck): Shouldn't be chars.
    # TODO(arwck): This shouldn't be serialized, either.

    mentor: User = \
        models.ForeignKey('User',
                          null=True,
                          on_delete=models.SET_NULL)

    # TODO(arwck): Figure out if this works
    def get_mentees(self) -> List[type['User']]:
        """ Retrieves the list of mentees for this user.
        :return the set of users who have this user as their mentor.
        """
        return self.user_set.all()

    @staticmethod
    def print_all_users() -> None:
        print(" ,-----------------------------------------------------------")
        print(" | " + " Printing all users...")
        for u in User.objects.all().iterator():
            print(" | ---------------------------------------------------- ")
            print(" | " + str(u))
            print(f" | {u.pk=}")
            print(f" | {u.id=}")
            print(" | " + u.first_name)
            print(" | " + f"{u.mentor=}")
        print(" `-----------------------------------------------------------")


@dataclass(init=False)
class Meeting(models.Model):
    mentee: User = models.ForeignKey('User', null=True, related_name='meeting_mentee',
                                     on_delete=models.SET_NULL)  # if the mentee is deleted set mentee to null
    mentor: User = models.ForeignKey('User', null=True, related_name='meeting_mentor',
                                     on_delete=models.SET_NULL)  # if the mentor is deleted set mentor to null
    time: datetime = models.DateTimeField()  # time of meeting


@dataclass(init=False)
class ActionPlan(models.Model):
    mentee: User = models.ForeignKey('User', null=True, related_name='actionplan_mentee',
                                     on_delete=models.SET_NULL)  # if the mentee is deleted set mentee to null
    mentor: User = models.ForeignKey('User', null=True, related_name='actionplan_mentor',
                                     on_delete=models.SET_NULL)  # if the mentor is deleted set mentor to null
    creation_date: datetime = models.DateTimeField()  # creation date of action plan
    completion_date: datetime = models.DateTimeField()  # completion date of action plan


def create_dummy_data() -> None:
    try:
        user_count: int = User.objects.count()
    except OperationalError:
        return

    if user_count > 0:
        return

    Arpad = User.objects.create(first_name='Arpad',
                                last_name='Kiss',
                                email='arpad.kiss@warwick.ac.uk',
                                is_email_verified=False,
                                password='nunya',
                                mentor=None)

    Isaac = User.objects.create(first_name='Isaac',
                                last_name='IDFK',
                                email='isaac.idfk@warwick.ac.uk',
                                is_email_verified=False,
                                password='aynun',
                                mentor=Arpad)

    arpad_isaac_meeting = Meeting.objects.create(
        mentee=User.objects.get(first_name='Arpad'),
        mentor=User.objects.get(first_name='Isaac'),
        time=datetime.utcnow()
    )

    print(" ,-----------------------------------------------------------")
    print(" | " + " Created dummy data for the first time...")
    for u in User.objects.all().iterator():
        print(" | " + str(u))
        print(f" | {u.pk=}:")
        print(f" | {u.id=}:")
        print(" | " + u.first_name)
        print(" | " + f"{u.mentor=}")
    print(" `-----------------------------------------------------------")


# TODO(arwck): This doesn't work
def clear_dummy_data() -> None:
    y: bool = input(" > Are you sure you want to delete all data? y/n") == "y"
    if y:
        User.objects.all().delete()
        Meeting.objects.all().delete()
        ActionPlan.objects.all().delete()
        print(" < Deleted all dummy data.")
    else:
        print(" < Did not delete.")


create_dummy_data()
