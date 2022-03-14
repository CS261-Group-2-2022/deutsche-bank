#!/usr/bin/env python3
from typing import *

import itertools
import random
import numpy as np

from django.test import TestCase
from rest_framework.test import force_authenticate
from rest_framework.test import APIRequestFactory
from .dummy_data import *
from .models import *
from .tests import show_res
from .views import *
from .matching_algorithm import *

class InterestAndExpertiseOverlapUnitTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        create_dummy_data(quiet=True)

    def test_unit_interest_and_expertise_overlap_false_case(self):
        user_interests = Skill.choose_list_at_random()

        def exclude_user_interests(q):
            return q.exclude(pk__in=[skill.pk for skill in user_interests])
        mentor_expertise = Skill.choose_list_at_random(map_with=exclude_user_interests)

        self.assertFalse(interests_and_expertise_overlap(set(user_interests), mentor_expertise))

    def test_unit_interest_and_expertise_overlap_true_case(self):
        user_interests = Skill.choose_list_at_random()

        mentor_expertise = Skill.choose_list_at_random()
        mentor_expertise.append(random.choice(user_interests))

        self.assertTrue(interests_and_expertise_overlap(set(user_interests), mentor_expertise))

class MatchingAlgorithmTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        create_dummy_data(quiet=True)

    def test_sorting_by_score_works(self):
        mentors = User.choose_list_at_random()
        scores = [random.uniform(0, 1) for _ in mentors]

        scores_vector = np.zeros((len(mentors), 1), np.dtype(object))
        i = 0
        for score in scores:
            scores_vector[i][0] = score
            i += 1

        got = sort_by_score(mentors, scores_vector)
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


class MatchingAlgorithmIntegrationTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        create_dummy_business_areas()
        create_dummy_skills()

    def test_matching_algorithm_endpoint_empty_if_no_mentors_match(self):
        user_looking_for_mentor = User.make_random()

        factory = APIRequestFactory()
        request = factory.get('/api/v1/user/' + str(user_looking_for_mentor.pk) + '/matching',
                               follow=True)
        force_authenticate(request, user=user_looking_for_mentor)

        view = UserViewSet.as_view({'get': 'matching'})
        response = view(request, pk=user_looking_for_mentor.pk)

        ## Check that the endpoint correctly signifies there are no mentors available.
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)
