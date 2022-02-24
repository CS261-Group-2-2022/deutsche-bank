#!/usr/bin/env python3
from typing import *

from django.db import OperationalError

from .models import *
import random

from .models import User, Skill, BusinessArea

""" This file contains code for creating dummy data.
"""


def add_dummy_expertise_to(user: User):
    number_of_expertises_available = Skill.objects.count()
    number_of_expertises_to_add = random.randint(2, number_of_expertises_available)
    expertises = random.sample([e for e in Skill.objects.all().iterator()], number_of_expertises_to_add)

    for e in expertises:
        user.expertise.add(e)
    user.save()


def create_dummy_action_plan(user):
    action_plan_count: int = ActionPlan.objects.count()

    if action_plan_count > 0:
        return

    Do_The_Project = ActionPlan.objects.create(name="Do the project.",
                                               description="Complete and submit the CS261 Software Engineering project.",
                                               user=user,
                                               creation_date=datetime.utcnow(),
                                               completion_date=None)
def create_dummy_users():
    print(f'Debug 1')
    user_count: int = User.objects.count()

    if user_count > 0:
        return
    print(f'Debug 2')

    number_of_users_to_create = 2

    business_areas: List[BusinessArea]
    business_areas = random.sample([b for b in BusinessArea.objects.all().iterator()], number_of_users_to_create)

    Arpad = User.objects.create(first_name='Arpad',
                                last_name='Kiss',
                                business_area=business_areas[0],
                                email='arpad.kiss@warwick.ac.uk',
                                is_email_verified=False,
                                password='nunya',
                                mentorship=None)
    print(f'Debug 3')
    add_dummy_expertise_to(Arpad)

    print(f'Debug 3')
    Isaac = User.objects.create(first_name='Isaac',
                                last_name='IDFK',
                                business_area=business_areas[1],
                                email='isaac.idfk@warwick.ac.uk',
                                is_email_verified=False,
                                password='aynun',
                                mentorship=None)
    add_dummy_expertise_to(Isaac)

    print(f'Setting up mentorship...')
    mentorship = Mentorship.objects.create(
        mentee=Isaac,
        mentor=Arpad
    )
    Arpad.mentorship = mentorship
    Arpad.save(update_fields=['mentorship'])
    print(f'Saved new arpad user with mentorship {Arpad.mentorship}')

    add_dummy_expertise_to(user=Isaac)

    create_dummy_meetings(mentorship=mentorship)
    create_dummy_action_plan(user=Arpad)

    print(" ,-----------------------------------------------------------")
    print(" | " + " Created dummy users for the first time...")
    for u in User.objects.all().iterator():
        print(" | " + str(u))
        print(f" | {u.pk=}:")
        print(f" | {u.id=}:")
        print(" | " + u.first_name)
        print(" | " + f"{u.mentorship.mentor if u.mentorship is not None else 'None'}")
    print(" `-----------------------------------------------------------")


def create_dummy_meetings(mentorship: Mentorship):
    arpad_isaac_meeting = Meeting.objects.create(
        mentorship=mentorship,
        time=datetime.utcnow()
    )

def create_dummy_business_areas():
    business_area_count: int = BusinessArea.objects.count()

    if business_area_count > 0:
        return

    Corporate_Finance = BusinessArea.objects.create(name="Corporate Finance")
    Equities = BusinessArea.objects.create(name="Equities")
    Global_Capital_Markets = BusinessArea.objects.create(name="Global Capital Markets")
    Global_Transaction_Banking = BusinessArea.objects.create(name="Global Transaction Banking")
    Deutsche_Bank_Research = BusinessArea.objects.create(name="Deutsche Bank Research")
    Private_and_Commercial_Banking = BusinessArea.objects.create(name="Private and Commercial Banking")
    Wealth_Management = BusinessArea.objects.create(name="Wealth Management")
    Deutsche_Asset_Management = BusinessArea.objects.create(name="Deutsche Asset Management")


def create_dummy_skills():
    expertise_count: int = Skill.objects.count()

    if expertise_count > 0:
        return

    Corporate_Finance_Expert = Skill.objects.create(name="Corporate Finance Expert")
    Equities_Expert = Skill.objects.create(name="Equities Expert")
    Global_Capital_Markets_Expert = Skill.objects.create(name="Global Capital Markets Expert")
    Global_Transaction_Banking_Expert = Skill.objects.create(name="Global Transaction Banking Expert")
    Deutsche_Bank_Research_Expert = Skill.objects.create(name="Deutsche Bank Research Expert")
    Private_and_Commercial_Banking_Expert = Skill.objects.create(name="Private and Commercial Banking Expert")
    Wealth_Management_Expert = Skill.objects.create(name="Wealth Management Expert")
    Deutsche_Asset_Management_Expert = Skill.objects.create(name="Deutsche Asset Management Expert")

def create_dummy_data():
    try:
        create_dummy_business_areas()
        create_dummy_skills()
        create_dummy_users()
    except OperationalError:
        print(f'Error')
        pass
