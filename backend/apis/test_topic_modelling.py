#!/usr/bin/env python3
from typing import *

import random
import itertools

from django.test import TestCase
from .topic_modelling import get_interest_description_similarities
from .dummy_data import create_dummy_business_areas, create_dummy_skills, create_dummy_users, create_dummy_data
from .models import User

class InterestDescriptionTestCase(TestCase):

    @classmethod
    def setUpTestData(cls):
        create_dummy_data(quiet=True, seed="Interest description test case")

    def test_interest_description_sims_understands_negative_points_of_view(self):
        users_that_like_apples = [
            User.make_random(interests_description = "I love apples."),
            User.make_random(interests_description = "I like apples."),
            User.make_random(interests_description = "I enjoy apples."),
            User.make_random(interests_description = "I'm ok with apples."),
        ]

        users_that_hate_apples = [
            User.make_random(interests_description = "I hate apples."),
            User.make_random(interests_description = "I dislike apples."),
        ]

        similarity_of_likes = min([get_interest_description_similarities(a, [b])[0]
                                   for (a, b) in itertools.product(users_that_like_apples,
                                                                   users_that_like_apples)])

        similarity_of_hates_to_likes = max([get_interest_description_similarities(b, [a])[0]
                                            for (a, b) in itertools.product(users_that_hate_apples,
                                                                            users_that_like_apples)])

        self.assertGreaterEqual(similarity_of_likes, similarity_of_hates_to_likes)

    def test_interest_description_sims_returns_floats_between_0_and_1(self):
        got = get_interest_description_similarities(User.choose_random(),
                                                    User.choose_list_at_random())

        for sim in got:
            self.assertGreaterEqual(1, sim)
            self.assertGreaterEqual(sim, 0)

    def test_interest_description_sims_is_same_length_as_mentors(self):
        mentor_list = User.choose_list_at_random()
        got = get_interest_description_similarities(User.choose_random(), mentor_list)

        self.assertEqual(len(got), len(mentor_list))

    def test_interest_description_sims_raises_error_on_empty_mentors(self):
        with self.assertRaises(expected_exception=ValueError) as cm:
            get_interest_description_similarities(User.choose_random(), [])
