#!/usr/bin/env python3
from typing import *

import itertools
import random

from django.test import TestCase
from .dummy_data import create_dummy_data
from .models import *
from .matching_algorithm import sort_by_score, NoPossibleMentorsError, matching_algorithm

class MatchingAlgorithmTestCase(TestCase):

    @classmethod
    def setUpTestData(cls):
        create_dummy_data(quiet=True)

    def test_sorting_by_score_works(self):
        mentors = User.choose_list_at_random()
        scores = [random.uniform(0, 1) for _ in mentors]

        got = sort_by_score(mentors, scores)
        expected = [m for (m, s) in sorted(zip(mentors, scores),
                                           key=lambda p: p[1],
                                           reverse=True)]

        self.assertListEqual(got, expected)

    def test_matching_algorithm_raises_error_on_incompatible_business_areas(self):
        user_looking_for_mentor = User.make_random(business_area=BusinessArea.choose_random())

        number_of_mentors_to_make = random.randint(1,15)
        mentors = []

        for _ in range(number_of_mentors_to_make):
            mentor = User.make_random(business_area=user_looking_for_mentor.business_area)
            mentors.append(mentor)

        all_users = mentors + [user_looking_for_mentor]
        all_mentorships = []
        current_mentorships = []
        all_requests = []

        with self.assertRaises(expected_exception=NoPossibleMentorsError) as cm:
            got = matching_algorithm(user_looking_for_mentor,
                                    all_users, mentors,
                                    all_mentorships, current_mentorships,
                                    all_requests)

    def test_matching_algorithm_raises_error_on_no_overlapping_interests(self):
        user_looking_for_mentor = User.make_random()

        number_of_mentors_to_make = random.randint(1,6)
        mentors = []

        user_interest_pks = [i.pk for i in user_looking_for_mentor.interests.all()]

        for _ in range(number_of_mentors_to_make):
            exclude_interests_of_user = lambda query: query.exclude(pk__in=user_interest_pks)
            expertise = []

            while len(expertise) == 0:
                expertise = Skill.choose_list_at_random(map_with=exclude_interests_of_user)

            mentor = User.make_random(expertise=expertise)
            mentors.append(mentor)

        all_users = mentors + [user_looking_for_mentor]
        all_mentorships = []
        current_mentorships = []
        all_requests = []

        with self.assertRaises(expected_exception=NoPossibleMentorsError) as cm:
            got = matching_algorithm(user_looking_for_mentor,
                                    all_users, mentors,
                                    all_mentorships, current_mentorships,
                                    all_requests)
