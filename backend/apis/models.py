#!/usr/bin/env python3
from __future__ import annotations # This allows us to use type hints of a class inside that class.
from django.db import models
from typing import *
from dataclasses import dataclass

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
    id: int = models.AutoField(primary_key=True, unique=True)
    name: str = models.CharField(max_length = 100, unique=True)

@dataclass
class UserById:
    """ Utility class, used only as a type hint, so that when we serialize Users to JSON, we can
    prevent the whole User instance being sent, and instead send only the id of the user.
    """
    id: int

@dataclass(init=False)
class User(models.Model):
    """ Database model that describes a single User.
    """
    id : int = models.AutoField(primary_key=True, unique=True)

    first_name : str = models.CharField(max_length = 100)
    last_name : str = models.CharField(max_length = 100)

    business_area : BusinessArea | None = models.ForeignKey('BusinessArea',
                                                            null=True,
                                                            on_delete=models.SET_NULL)

    # Users also are experts in a set of fields. See get_expertise below.
    # This is encoded by the UserExpertise model, which relates them together.

    email : str = models.EmailField(max_length = 100)
    is_email_verified : bool = models.BooleanField()

    password : str = models.CharField(max_length = 100) # TODO(arwck): Shouldn't be chars.

    mentor : UserById = \
        models.ForeignKey('User',
                          null=True,
                          on_delete=models.SET_NULL)

    def get_expertise(self) -> List[Type[User]]:
        return self.userexpertise_set.all()

    # TODO(arwck): Make an endpoint for this
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
    id: int = models.AutoField(primary_key=True, unique=True)
    name: str = models.CharField(max_length = 100, unique=True)

@dataclass(init=False)
class UserExpertise(models.Model):
    """ Database model that encodes that a given user has a given expertise.

    Any user can have multiple areas of expertise, and any expertise may have many users that are
    experts in that field, therefore we need a database table like this to encode this information.

    Attributes
    ----------
    user
        The User object that this expertise belongs to.
        This is related by a foreign key relation.
        Also, this has the type hint 'UserById', so that when we serialize to JSON, the whole User
        object doesn't get sent.
    expertise
        The Expertise object that this link relates to.
        This denotes what the person is actually an expert in.
        This is related by a foreign key relation.
    """
    user: UserById = models.ForeignKey('User',
                                   null=False,
                                   on_delete=models.CASCADE)
    expertise: Expertise = models.ForeignKey('Expertise',
                                             null=False,
                                             on_delete=models.CASCADE)

from .dummy_data import *

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

create_dummy_data()
print_all_users()
