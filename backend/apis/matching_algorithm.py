#!/usr/bin/env python3
from typing import *

from .models import *

def matching_algorithm(user_looking_for_mentor: User,

                       all_users: List[User],
                       users_who_want_to_mentor: List[User],

                       all_mentorships: List[Mentorship],
                       current_mentorships: List[Mentorship],

                       all_requests: List[Request]) -> List[User]:
    print("Hi from matching algo.")
    print(f"{user_looking_for_mentor=}")
    return users_who_want_to_mentor

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
