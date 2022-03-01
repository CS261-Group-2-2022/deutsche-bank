#!/usr/bin/env python3
from __future__ import annotations  # This allows us to use type hints of a class inside that class.

from datetime import datetime
import random

from django.conf import settings
from django.contrib.auth.base_user import AbstractBaseUser
from django.db import models
from django.db.models import QuerySet
from django.db.models import Avg

from .dummy_data_dataset import dataset

from .managers import UserManager

""" This file contains the database models and some associated utilities.
"""

class Randomisable:
    @classmethod
    def choose_random(cls) -> Type[cls]:
        return random.choice(cls.objects.all())

    @classmethod
    def choose_list_at_random(cls,
                              minimum_number = 1,
                              maximum_number = None,
                              map_with = None) -> List[Type[cls]]:
        pool = []
        if map_with == None:
            pool = list(cls.objects.all())
        else:
            pool = list(map_with(cls.objects.all()))

        count = len(pool)

        if maximum_number is not None:
            maximum_number = min(count, maximum_number)
        else:
            maximum_number = count

        how_many_to_choose = 1
        if minimum_number < maximum_number:
            how_many_to_choose = random.randint(minimum_number, maximum_number)

        return random.sample(pool, how_many_to_choose)

    @classmethod
    def make_random(cls) -> Type[cls]:
        raise NotImplementedError()

class Skill(models.Model, Randomisable):
    """ Database model that holds all the 'kinds' of expertise users may have.

    This can then be searched through during account creation to select your areas of expertise.
    Further, this is also used in the storage of this information - see UserExpertise.
    """
    name: str = models.CharField(max_length=100, unique=True)


class BusinessArea(models.Model, Randomisable):
    """ Database model that stores the business areas that are in the company.

    This can then be searched through during account creation to select your business area, or more
    can be created later on.
    Further, this is also used in the storage of this information - see the User model's
    business_area field.
    """
    name: str = models.CharField(max_length=100, unique=True)


from dataclasses import dataclass
@dataclass(init=False)
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


# TODO: Remove PermissionsMixin if it is not required
class User(AbstractBaseUser, Randomisable):
    """ Database model that describes a single User.
    """
    first_name: str = models.CharField(max_length=100)
    last_name: str = models.CharField(max_length=100)

    business_area: BusinessArea = models.ForeignKey('BusinessArea', null=True, on_delete=models.SET_NULL)

    email: str = models.EmailField(max_length=100, unique=True)  # identifies each user instead of username
    is_email_verified: bool = models.BooleanField(default=False)

    mentorship: Mentorship = models.OneToOneField(Mentorship, null=True, on_delete=models.SET_NULL)
    mentor_intent: bool = models.BooleanField(default=False)  # whether a user wishes to become a mentor

    interests: List[Skill] = models.ManyToManyField(Skill, related_name='user_interests', blank=True)
    expertise: List[Skill] = models.ManyToManyField(Skill, related_name='user_expertise', blank=True)

    interests_description: str = models.CharField(max_length=500, default="")

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
        return User.objects.all().filter(mentorship__mentor__pk__exact=self.pk).exclude(pk__exact=self.pk)

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

    def has_mentees(self) -> bool:
        return self.get_mentees().count() > 0

    def get_mentorships_where_user_is_mentor(self) -> QuerySet[List[Type[User]]]:
        return Mentorship.objects.all().filter(mentor__pk__exact=self.pk)

    def get_mentor_rating_average(self) -> float:
        ret = self.get_mentorships_where_user_is_mentor().aggregate(Avg('rating'))['rating__avg']
        if ret == None:
            return 4
        else:
            return ret

    @classmethod
    def choose_random(cls) -> Type[User]:
        return random.choice(cls.objects.all())

    @classmethod
    def choose_list_at_random(cls) -> List[Type[User]]:
        return random.sample(list(cls.objects.all()),
                             random.randint(1, cls.objects.all().count()))

    # TODO Add to a mixin type thing.
    @classmethod
    def make_distinct_email_from(cls, first_name, last_name):
        email_domain = "deutschebank"
        email = ''
        number_of_people_with_same_name = cls.objects.all().filter(first_name=first_name,
                                                                   last_name=last_name).count()
        if number_of_people_with_same_name > 0:
            email = f'{first_name}.{last_name}.{number_of_people_with_same_name}@{email_domain}.com'
        else:
            email = f'{first_name}.{last_name}@{email_domain}.com'

        return email

    @classmethod
    def make_random(cls,
                    skills_pool : List[Skill] = None,
                    business_area_pool : List[BusinessArea] = None,
                    dataset = dataset,
                    **kwargs_for_user_constructor) -> Type[User]:
        if skills_pool == None:
            skills_pool = list(Skill.objects.all())

        business_area = ''
        if 'business_area' in kwargs_for_user_constructor:
            business_area = kwargs_for_user_constructor.pop('business_area')
        else:
            if business_area_pool == None:
                business_area_pool = list(BusinessArea.objects.all())

            business_area=random.choice(business_area_pool)

        first_name=random.choice(dataset["first_names"])
        last_name=random.choice(dataset["last_names"])

        email_domain = "deutschebank.com"

        interests = []
        if 'interests' in kwargs_for_user_constructor:
            interests = kwargs_for_user_constructor.pop('interests')
        else:
            interests = random.sample(skills_pool, random.randrange(1,7))

        expertise = []
        if 'expertise' in kwargs_for_user_constructor:
            expertise = kwargs_for_user_constructor.pop('expertise')
        else:
            expertise = random.sample(skills_pool, random.randrange(1,7))

        mentor_intent = False
        if 'mentor_intent' in kwargs_for_user_constructor:
            mentor_intent = kwargs_for_user_constructor.pop('mentor_intent')
        else:
            mentor_intent = random.choice([False, True])


        password = 'nunya'
        if 'password' in kwargs_for_user_constructor:
            password = kwargs_for_user_constructor.pop('password')


        email = None
        if 'email' in kwargs_for_user_constructor:
            email = kwargs_for_user_constructor.pop('email')
        else:
            email = User.make_distinct_email_from(first_name, last_name)

        u = cls.objects.create(first_name=first_name,
                               last_name=last_name,
                               business_area=business_area,
                               email=email,
                               is_email_verified=True,
                               mentor_intent=mentor_intent,
                               **kwargs_for_user_constructor)

        # TODO Make tests for this.
        u.set_password(password)

        u.interests.set(interests)
        u.expertise.set(expertise)

        u.save()

        return u

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
    location: str = models.CharField(null=True, max_length=100, blank=True)
    virtual_link: str = models.CharField(null=True, max_length=100, blank=True)
    image_link: str = models.CharField(null=True, max_length=100, blank=True)
    description: str = models.CharField(null=True, max_length=2000, blank=True)
    host: User = models.ForeignKey(User, related_name='session_host',
                                   on_delete=models.CASCADE)  # if host is deleted, delete session
    capacity: int = models.IntegerField(null=True)
    skills: List[Skill] = models.ManyToManyField(Skill)
    date: datetime = models.DateTimeField()
    users: List[User] = models.ManyToManyField(User, default=[], blank=True)


class Feedback(models.Model):
    date: datetime = models.DateTimeField()
    feedback: str = models.CharField(max_length=1000)
