#!/usr/bin/env python3
from typing import *
from dataclasses import *

from .models import *

import yake

# Topic modelling
def get_interest_description_similarities(user: User, mentors: List[User]) -> List[float]:
    if len(mentors) == 0:
        raise ValueError("Got empty mentors list.")

    kw_extractor = yake.KeywordExtractor(dedupFunc='jaro')
    user_interests_kws = dict(kw_extractor.extract_keywords(user.interests_description))

    def keyword_similarity(u):
        mentor_kws = [w for (w, n) in kw_extractor.extract_keywords(u.interests_description)]

        matches = len([k for k in mentor_kws if k in user_interests_kws])

        return matches / max(len(user_interests_kws), len(mentor_kws), 1)


    return [keyword_similarity(m) for m in mentors]
