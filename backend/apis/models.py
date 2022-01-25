#!/usr/bin/env python3
from __future__ import annotations # This allows us to use type hints of a class inside that class.
from django.db import models
from typing import *
from dataclasses import dataclass


@dataclass
class UserById:  # avoid recursive user lookup
    id: int


@dataclass(init=False)
class User(models.Model):
    id : int = models.AutoField(primary_key=True, unique=True)

    first_name : str = models.CharField(max_length = 100)
    last_name : str = models.CharField(max_length = 100)

    # TODO(arwck): Figure out how emailfield works
    email : str = models.EmailField(max_length = 100)
    is_email_verified : bool = models.BooleanField()

    password : str = models.CharField(max_length = 100) # TODO(arwck): Shouldn't be chars.
    # TODO(arwck): This shouldn't be serialized, either.

    # TODO(arwck): This should be an primary key or a link in the json, but currently it totally isn't.
    # So, we need to change the type hint here to something that'll get it to give the right result
    # mentor : type['User']
    # mentor : type[User] # Only allowed if we import __future__ annotations
    # mentor : User # Only allowed if we import __future__ annotations
    mentor : UserById = \
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

def create_dummy_data():
    user_count : int = User.objects.count()

    if user_count > 0:
        return

    Arpad = User.objects.create(first_name = 'Arpad',
                        last_name = 'Kiss',
                        email = 'arpad.kiss@warwick.ac.uk',
                        is_email_verified = False,
                        password = 'nunya',
                        mentor = None)

    Isaac = User.objects.create(first_name = 'Isaac',
                        last_name = 'IDFK',
                        email = 'isaac.idfk@warwick.ac.uk',
                        is_email_verified = False,
                        password = 'aynun',
                        mentor = Arpad)

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
def clear_dummy_data():
    y : bool = input(" > Are you sure you want to delete all data? y/n") == "y"
    if y:
        User.objects.all().delete()
        print(" < Deleted all dummy data.")
    else:
        print(" < Did not delete.")


create_dummy_data()
User.print_all_users()
