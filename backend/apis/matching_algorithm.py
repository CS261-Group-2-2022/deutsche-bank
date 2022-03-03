#!/usr/bin/env python3
from typing import *

from pprint import pprint

import numpy as np

from .models import *
from .topic_modelling import *

class NoPossibleMentorsError(Exception):
    pass

def sort_by_score(mentors: List[User], scores: np.matrix) -> List[User]:
    matrix = np.zeros((len(mentors), 2), np.dtype(object))

    for i in range(len(mentors)):
        matrix[i][0] = scores[i][0]
        matrix[i][1] = mentors[i]

    sortedMatrix = matrix[np.argsort(matrix[:,0])]
    ret = [mentor for [score, mentor] in sortedMatrix]
    ret.reverse()
    return ret

def interests_and_expertise_overlap(user_interests, mentor_expertise):
    return not user_interests.isdisjoint(set(mentor_expertise))

def matching_algorithm(user_looking_for_mentor: User,

                       all_users: List[User],
                       users_who_want_to_mentor: List[User],

                       all_mentorships: List[Mentorship],
                       current_mentorships: List[Mentorship],

                       all_requests: List[MentorRequest]) -> List[User]:

    prior_user_mentorships = list(filter(lambda m: m.mentee == user_looking_for_mentor,
                                         all_mentorships))
    requests_by_user = list(filter(lambda r: r.mentee == user_looking_for_mentor, all_requests))
    # Step 1:
    # 1.1) Find user's past mentors. (user_past_mentorships)
    # 1.2) Array of all the mentors the user has currently requested (pending).
    #      (user_current_requests)
    # 1.3) List of all requested mentors where the mentor has rejected the request.
    #      (user_requests_rejected_by_mentor)
    # 1.4) List of all mentors with currently pending requests.
    # 1.5) List of current mentorships (just all the mentor mentee pairings currently active)

    # Step 2:
    # Filter out unwanted mentors out of users_who_want_to_mentor.
    # Don't want:
    #   user.BA == mentor.BA
    #
    #   user.interests \cap mentor.expertise = \emptyset
    #
    #   user had relationship with mentor before
    #
    #   user has already been offered mentor

    # Standard compatibility check
    def has_compatible_business_areas(mentor: User):
        return user_looking_for_mentor.business_area != mentor.business_area

    # Criteria based on interest & expertise overlap
    user_interests = set(user_looking_for_mentor.interests.all())

    def count_overlapping_skills(mentor: User):
        return len(set(user_interests).intersection(mentor.expertise.all()))

    # Criteria based on user's history
    def has_not_had_relationship_before(mentor: User):
        return len(list(filter(lambda mentorship: mentorship.mentor == mentor,
                               prior_user_mentorships))) == 0

    def is_not_already_offered(mentor: User):
        return len(list(filter(lambda req: req.mentor == mentor, requests_by_user))) == 0

    def is_valid_mentor_option(mentor: User):
        return has_compatible_business_areas(mentor) and \
               interests_and_expertise_overlap(user_interests, mentor.expertise.all()) and \
               has_not_had_relationship_before(mentor) and \
               is_not_already_offered(mentor)

    possible_mentors = list(filter(is_valid_mentor_option, users_who_want_to_mentor))

    if len(possible_mentors) == 0:
        raise NoPossibleMentorsError("")

    v1 = np.zeros((len(possible_mentors), 1))
    v2 = np.zeros((len(possible_mentors), 1))
    v3 = np.zeros((len(possible_mentors), 1))
    v4 = np.zeros((len(possible_mentors), 1))
    i = 0
    for mentor in possible_mentors:
        v1[i][0] = i
        # TODO Could be optimised, could get average of all possible_mentors straight in SQL.
        v2[i][0] = mentor.get_mentor_rating_average() # TODO NAN for matching user 778
        v3[i][0] = count_overlapping_skills(mentor) 
        v4[i][0] = mentor.get_mentees().count()
        i += 1

    # v5 - NLP for interest description similarity.
    v5 = np.zeros((len(possible_mentors), 1))
    v5 = np.array(get_interest_description_similarities(user_looking_for_mentor, possible_mentors))

    def calculate_score_vector(factor = 0.3):
        return (v2 * (v3 + v5)) / len(user_interests) - (factor) * v4

    scores = calculate_score_vector()

    return sort_by_score(possible_mentors, scores)
