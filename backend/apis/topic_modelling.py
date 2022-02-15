#!/usr/bin/env python3
from typing import *
from dataclasses import *

from .models import *

import yake

# Topic modelling
def sort_by_interest_description_match(user: User, mentor_pool: [User]) -> [User]:
    kw_extractor = yake.KeywordExtractor(dedupFunc='jaro')
    user_interests_kws = dict(kw_extractor.extract_keywords(user.interests_description))

    def keyword_similarity(u) -> 'int[0,1]':
        kws = [w for (w, n) in kw_extractor.extract_keywords(u.interests_description)]

        matches = 0

        for k in kws:
            if k in user_interests_kws:
                matches = matches + 1

        return matches / max(min(len(user_interests_kws), len(kws)), 1)

    mentors_and_similarities = [(m, keyword_similarity(m)) for m in mentor_pool]
    mentors_and_similarities.sort(key=lambda p: p[1], reverse=True)
    return mentors_and_similarities

def get_interest_description_similarities(user: User, mentors: [User]) -> [float]:
    kw_extractor = yake.KeywordExtractor(dedupFunc='jaro')
    user_interests_kws = dict(kw_extractor.extract_keywords(user.interests_description))

    def keyword_similarity(u) -> 'int[0,1]':
        kws = [w for (w, n) in kw_extractor.extract_keywords(u.interests_description)]

        matches = 0

        for k in kws:
            if k in user_interests_kws:
                matches = matches + 1

        return matches / max(min(len(user_interests_kws), len(kws)), 1)

    return [keyword_similarity(m) for m in mentors]

from collections import defaultdict
from gensim import corpora
from gensim import models
from gensim import similarities

def sort_by_self_description_similarity(user: User, mentors: [User]):
    if user.self_description == "":
        return mentors

    documents = [m.self_description.lower().split() for m in mentorsa if m.self_description != ""]
    if len(documents) == 0:
        return mentors

    ignore = set('for a of the and to in'.split())
    texts = [[w for w in document if w not in ignore] for document in documents]

    frequency = defaultdict(int)
    for text in texts:
        for token in text:
            frequency[token] += 1
    texts = [[token for token in text if frequency[token] > 1] for text in texts]

    dictionary = corpora.Dictionary(texts)
    corpus = [dictionary.doc2bow(text) for text in texts]

    lsi = models.LsiModel(corpus, id2word=dictionary, num_topics=2)

    query = lsi[dictionary.doc2bow(user.self_description.lower().split())]

    index = similarities.MatrixSimilarity(lsi[corpus])

    sims = index[query]

    return [mentors[i] for (i, _) in sorted(enumerate(sims), key=lambda p: p[1], reverse=True)]

def get_self_description_similarities(user: User, mentors: [User]) -> [float]:
    if user.self_description == "":
        print("[Warning]: user.self_description empty in get_self_description_similarities")
        return [0 for m in mentors]

    documents = [m.self_description.lower().split() for m in mentorsa if m.self_description != ""]
    if len(documents) == 0:
        return mentors

    ignore = set('for a of the and to in'.split())
    texts = [[w for w in document if w not in ignore] for document in documents]

    frequency = defaultdict(int)
    for text in texts:
        for token in text:
            frequency[token] += 1
    texts = [[token for token in text if frequency[token] > 1] for text in texts]

    dictionary = corpora.Dictionary(texts)
    corpus = [dictionary.doc2bow(text) for text in texts]

    lsi = models.LsiModel(corpus, id2word=dictionary, num_topics=2)

    query = lsi[dictionary.doc2bow(user.self_description.lower().split())]

    index = similarities.MatrixSimilarity(lsi[corpus])

    sims = index[query]

    # TODO Ensure this returns exactly what we want it to. (is sims[0][1] a valid number between 0 and 1?)
    return [s for (_, s) in enumerate(sims)]
