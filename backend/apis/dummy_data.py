#!/usr/bin/env python3
from typing import *

from django.db import OperationalError

from .models import *
import random
from datetime import datetime, timedelta

from .models import User, Skill, BusinessArea

""" This file contains code for creating dummy data.
"""

def create_dummy_users(quiet = False):
    user_count: int = User.objects.count()

    from .dummy_data_dataset import dataset

    if user_count > 0:
        pass
        #return

    number_of_users_to_create = 50

    for _ in range(number_of_users_to_create):
        User.make_random()

def compatible(mentor, mentee):
    for i in mentee.interests.all().iterator():
        if i in list(mentor.expertise.all()):
            return True
    return False

def create_dummy_mentorships():
    mentorship_count: int = Mentorship.objects.count()

    if mentorship_count > 0:
        pass
        #return

    def new(mentor, mentee):
        rating = None
        if random.choice([True,False]):
            rating = random.randrange(0,10)

        feedback = None
        if random.choice([True,False]):
            feedback = lorem_random(max_length=Mentorship._meta.get_field('feedback').max_length)

        new_mentorship = Mentorship.objects.create(mentor=mentor,
                                                   mentee=mentee,
                                                   rating=rating,
                                                   feedback=feedback)
        mentee.mentorship = new_mentorship
        mentee.save()
        new_mentorship.save()

    number_of_mentorships_to_create = 50

    users_who_wish_to_mentor = list(User.objects.filter(mentor_intent=True))
    users_without_mentors = list(User.objects.filter(mentorship=None))

    pairings = [(mentor, mentee)
                for mentor in users_who_wish_to_mentor
                for mentee in users_without_mentors
                if compatible(mentor, mentee)]

    for i in range(number_of_mentorships_to_create):
        if len(pairings) < 1:
            return

        [(mentor, mentee)] = random.sample(list(pairings), 1)

        # Have a 2/3 chance that each possible pairing is rejected.
        if random.choice([True, False, False]):
            new(mentor, mentee)

        pairings = list(filter(lambda p: p[1] != mentee, pairings))

def lorem_random(max_length = None):
    if max_length is not None:
        space_for_lorems = max_length - len('Lorem ') - len('ipsum')
        number_of_lorems = space_for_lorems // len('lorem ')
        return "Lorem " + "lorem " * random.randrange(1, number_of_lorems) + "ipsum"
    else:
        return "Lorem " + "lorem " * random.randrange(1, 15) + "ipsum"


import pytz
time_start = datetime(2022, 2, 11, 10, 0, 0, 0, pytz.UTC)

def random_delta():
    return timedelta(days = random.randrange(0, 30),
                     hours = random.randrange(0, 8),
                     minutes = random.randrange(0, 60))

def create_dummy_meetings():
    meeting_count: int = Meeting.objects.count()

    if meeting_count > 0:
        return

    mentorships = Mentorship.objects.all()

    def new(mentorship):
        global time_start
        time = time_start + random_delta()

        mentor_notes = lorem_random(max_length=Meeting._meta.get_field('mentee_notes').max_length)
        mentee_notes = lorem_random(max_length=Meeting._meta.get_field('mentor_notes').max_length)

        new_meeting = Meeting.objects.create(mentorship=mentorship,
                                             time=time,
                                             mentor_notes=mentor_notes,
                                             mentee_notes=mentee_notes)

    for m in mentorships:
        n_of_meetings = random.randrange(0, 3)
        for _ in range(n_of_meetings):
            new(m)

def create_dummy_action_plans():
    action_plan_count: int = ActionPlan.objects.count()

    if action_plan_count > 0:
        return

    mentorships = Mentorship.objects.all()
    global time_start

    def new(mentorship):
        creation_date = time_start + random_delta()
        due_date = None
        if random.choice([True,False]):
            due_date = creation_date + random_delta()

        name = lorem_random(max_length=ActionPlan._meta.get_field('name').max_length)
        description = lorem_random(max_length=ActionPlan._meta.get_field('description').max_length)

        new_action_plan = ActionPlan.objects.create(name = name,
                                                    description = description,
                                                    user = mentorship.mentee,
                                                    creation_date = creation_date,
                                                    due_date = due_date)

    for m in mentorships:
        action_plan_count = random.randrange(0, 4)
        for _ in range(action_plan_count):
            new(m)

def create_dummy_group_sessions():
    group_session_count = GroupSession.objects.count()

    if group_session_count > 0:
        return

    users = User.objects.all()
    user_count = User.objects.count()

    users_with_sessions = random.sample(list(users), random.randrange(0, user_count))

    def new(u):
        max_to_pick = min(3, u.expertise.count())
        min_to_pick = 0
        skills = []
        if max_to_pick != 0:
            how_many_skills_in_event = random.randrange(min_to_pick, max_to_pick)
            skills = random.sample(list(u.expertise.all()), how_many_skills_in_event)

        name = lorem_random(max_length=GroupSession._meta.get_field('name').max_length)
        location = lorem_random(max_length=GroupSession._meta.get_field('location').max_length)
        description = lorem_random(max_length=GroupSession._meta.get_field('description').max_length)

        g = GroupSession.objects.create(name=name,
                                        location=location,
                                        description=description,
                                        host=u,
                                        capacity=random.randrange(0, 150),
                                        date=time_start + random_delta())
        g.skills.set(skills)
        g.users.set(random.sample(list(users), random.randrange(1, user_count)))
        g.save()

    for u in users_with_sessions:
        how_many_group_sessions = random.randrange(1,3)
        for _ in range(how_many_group_sessions):
            new(u)

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

    def new(name):
        Skill.objects.create(name=name).save()


    Corporate_Finance_Expert = Skill.objects.create(name="Corporate Finance Expert")
    Equities_Expert = Skill.objects.create(name="Equities Expert")
    Global_Capital_Markets_Expert = Skill.objects.create(name="Global Capital Markets Expert")
    Global_Transaction_Banking_Expert = Skill.objects.create(name="Global Transaction Banking Expert")
    Deutsche_Bank_Research_Expert = Skill.objects.create(name="Deutsche Bank Research Expert")
    Private_and_Commercial_Banking_Expert = Skill.objects.create(name="Private and Commercial Banking Expert")
    Wealth_Management_Expert = Skill.objects.create(name="Wealth Management Expert")
    Deutsche_Asset_Management_Expert = Skill.objects.create(name="Deutsche Asset Management Expert")

    # Financial Topics
    new("Microeconomics")
    new("Macroeconomics")
    new("Portfolio Management")
    new("High-frequency Trading")

    # Legal Topics
    new("Corporate Law")
    new("Financial Law")
    new("Intellectual Property Law")
    new("Contract Law")

    # Profession-related interests
    new("Debate")
    new("Public Speaking")
    new("Leadership")
    new("Planning and organisation skills")

    # Computer Science
    new("Algorithms")
    new("Artificial Intelligence")

    new("Big Data")
    new("Data Science")

    # Software Engineering
    new("Software Engineering")
    new("Containerisation")
    new("Distributed Systems")
    new("Software Scalability")
    new("Software Design Patterns")
    new("Software Version Control")

    # Programming Languages
    new("Python")
    new("MATLAB")
    new("Java")
    new("C#")
    new("JavaScript")
    new("TypeScript")
    new("C")
    new("C++")
    new("Bash")
    new("Skala")
    new("Swift")
    new("Haskell")
    new("F#")
    new("Lisp")

    # Software tools
    new("Docker")
    new("git")
    new("Github")
    new("Linux")

    # General office skills
    new("Word documents")
    new("Powerpoint presentations")
    new("Excel spreadsheets")
    new("Excel scripting")

    # Mathematics
    new("Linear Algebra")
    new("Calculus")
    new("Multivariate Calculus")
    new("Ordinary Differential Equations")
    new("Partial Differential Equations")
    new("Statistics")
    new("Statistical Modeling")


def create_dummy_data(quiet=False, seed="We're literally the best software eng team."):
    try:
        print(f"Creating dummy data ({seed=}).")
        if seed is None:
            random.seed()
        else:
            random.seed(seed)

        create_dummy_business_areas()
        create_dummy_skills()
        create_dummy_users(quiet)
        create_dummy_mentorships()
        create_dummy_meetings()
        create_dummy_action_plans()
        create_dummy_group_sessions()

        if quiet:
            return
        else:
            print(" ,-----------------------------------------------------------")
            print(" | " + " Created dummy users for the first time...")
            for u in User.objects.all().iterator():
                print(" | " + str(u))
                print(f" | {u.pk=}:")
                print(f" | {u.id=}:")
                print(" | " + u.first_name)
                print(" | " + f"{u.mentorship=}")
            print(" `-----------------------------------------------------------")
    except Exception as e:
        print(f'Error in create_dummy_data:')
        print(f'{e=}')
        raise e

from django.apps import apps

def clear_database(force = False):
    print("Are you sure you want to clear db?")
    if force or input("[y/n]>").lower() == 'y':
        models = apps.all_models['apis']
        for model in models:
            models[model].objects.all().delete()
