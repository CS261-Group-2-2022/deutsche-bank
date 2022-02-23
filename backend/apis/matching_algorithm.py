#!/usr/bin/env python3
from typing import *

from pprint import pprint

import numpy as np

from .models import *
from .topic_modelling import *
# TODO Maybe make use of these.

class NoPossibleMentorsError(Exception):
    pass

def matching_algorithm(user_looking_for_mentor: User,

                       all_users: List[User],
                       users_who_want_to_mentor: List[User],

                       all_mentorships: List[Mentorship],
                       current_mentorships: List[Mentorship],

                       all_requests: List[Request]) -> List[User]:

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
    def interests_and_expertise_overlap(mentor: User):
        return not user_interests.isdisjoint(mentor.expertise.all())

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
               interests_and_expertise_overlap(mentor) and \
               has_not_had_relationship_before(mentor) and \
               is_not_already_offered(mentor)

    possible_mentors = list(filter(is_valid_mentor_option, users_who_want_to_mentor))

    print(f"{len(possible_mentors)=}")

    if len(possible_mentors) == 0:
        raise NoPossibleMentorsError("")

    # TODO Could be optimised, could get average of all possible_mentors straight in SQL.

    v1 = np.zeros((len(possible_mentors), 1))
    v2 = np.zeros((len(possible_mentors), 1))
    v3 = np.zeros((len(possible_mentors), 1))
    v4 = np.zeros((len(possible_mentors), 1))
    v5 = np.zeros((len(possible_mentors), 1))
    i = 0
    for mentor in possible_mentors:
        v1[i][0] = i
        v2[i][0] = mentor.get_mentor_rating_average() # TODO NAN for matching user 778
        v3[i][0] = count_overlapping_skills(mentor) 
        v4[i][0] = mentor.get_mentees().count()
        i += 1

    #v2 = mentor_ratings = [m.get_mentor_rating_average() for m in possible_mentors]

    #v3 = mentor_overlapping_skill_counts = [count_overlapping_skills(m) for m in possible_mentors]
    # TODO
    # for each mentor
    # v4[mentors row] number of pending requer of pending requests they have waiting for them + factor * number of mentees they alreaddy have
    #v4 = mentor_current_mentee_counts = [m.get_mentees().count() for m in possible_mentors]

    newv5 = mentor_interest_description_sim = \
        get_interest_description_similarities(user_looking_for_mentor, possible_mentors)
    print("v5, mentor_interest_description_similarities is")
    pprint(newv5)

    factor = 0.3

    # TODO Factor in v5, mentor_interest_description_sim
    # These encode similarities of user's interest descriptions to the mentor description.
    # TODO Review that I did this scoring calculation right.
    #def score(i):
    #    return (v2 * v3) / len(user_interest) + factor * (1) # TODO(toni) get the factor sauce
        #return mentor_ratings[i] / mentor_overlapping_skill_counts[i] \
        #       - factor * mentor_current_mentee_counts[i]:119

    def score():
        #thinking to return (v2 * (v3 + newv5)) / len(user_interests) - (some factor) * v4
        return (v2 * v3) / len(user_interests) + factor * (1) 
    print("score is")
    pprint(score())

    v5 = np.stack((v1, score()),axis=1)
    print("v5 is:")
    pprint(v5) 

    #Toni code
    matrix = np.zeros((len(possible_mentors), 2), dtype(object))
    for i in range(len(possible_mentors)):
        matrix[i][0] = scores[i][0]
        matrix[i][1] = possible_mentors[i]
    sortedMatrix = matrix[np.argsort(matrix[:,0])]
    returnArray = [row[1] for row in sortedMatrix].reverse()
    #Toni code over

    #v5 = [(i, score(i)) for i in range(len(possible_mentors))]
    #v5.sort(key=lambda p: p[1], reverse=True) # Sort by score

    return possible_mentors
    #return [possible_mentors[i] for (i, _) in v5] # Return the mentors sorted by score.

if __name__ == "__main__":
    user_looking_for_mentor = User(first_name="Guy",
                                   last_name="Dude",
                                   business_area = BusinessArea(name="Department 1"),
                                   email= "guy.dude@dm.bank.com",
                                   is_email_verified= False,
                                   password= "nunya",
                                   mentorship= None,
                                   mentor_intent= False,
                                   interests=[Skill(name="Woodworking")],
                                   expertise=[])

    mentor = User(first_name="Smarty",
                  last_name="McMentors",
                  business_area = BusinessArea(name="Department 3"),
                  email= "big.brain@dm.bank.com",
                  is_email_verified= False,
                  password= "nunya",
                  mentorship=None,
                  mentor_intent=True,
                  interests=[],
                  expertise=[Skill(name="Woodworking")])

    all_users = [user_looking_for_mentor, a_mentor]

    users_who_want_to_mentor = [mentor]

    all_mentorships = []
    current_mentorships = []
    all_requests = []

    print("Matching algorithm says:")
    print(matching_algorithm(user_looking_for_mentor,
                             all_users, users_who_want_to_mentor,
                             all_mentorships, current_mentorships,
                             all_requests))
