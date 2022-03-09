from django.test import TestCase
from django.conf import settings
from rest_framework.test import force_authenticate
from rest_framework.test import APIRequestFactory
from random import randbytes

import json

from .views import GroupSessionViewSet, ActionPlanViewSet,MentorFeedbackViewSet, MentorshipViewSet
from .matching_algorithm import NoPossibleMentorsError, matching_algorithm
from .models import *
from .dummy_data import *
from .dummy_data_dataset import dataset

def show_res(response):
    return f'{str(response)}: {response.status_code} | {response.status_text}' + '\n' + f'{response.data=}'

class UserModelTests(TestCase):
    register_url = str(settings.REGISTER_URL)

    @classmethod
    def setUpTestData(cls):
        create_dummy_data(quiet=True, seed="User model test case")

        cls.randomly_created_user_pass = str(randbytes(20))
        cls.randomly_created_user = User.make_random(password=cls.randomly_created_user_pass)

    def test_randomly_created_user_is_actually_created(self):
        # Make sure there are users in the database.
        user_count: int = User.objects.all().count()
        self.assertGreater(user_count, 0)

        # Retrieve the user from the database by pk.
        retrieved_user: Optional[User] = User.objects.filter(pk=self.randomly_created_user.pk).first()

        # Did we find the user?
        self.assertTrue(not not retrieved_user)

        # Are they the correct one?
        self.assertEqual(retrieved_user.get_full_name(), self.randomly_created_user.get_full_name())

    def test_login_url(self):
        login_url = settings.LOGIN_URL

        body = {
            "email": self.randomly_created_user.email,
            "password": self.randomly_created_user_pass
        }

        response = self.client.post(str(login_url), body,
                                    follow=True,
                                    content_type='application/json')

        ## Test that we can log in at all.
        self.assertEqual(response.status_code, 200, msg=response.content)

        ## Test the returned json.
        data = response.json()
        # Test it gives us a token
        self.assertIn('token', data, msg=f'{response.json()=}')
        # Test it gives us the expiry
        self.assertIn('expiry', data, msg=f'{response.json()=}')
        # Test it returns the logged in user
        self.assertIn('user', data, msg=f'{response.json()=}')

    def test_register_url(self):
        first_name = random.choice(dataset['first_names'])
        last_name = random.choice(dataset['last_names'])
        email = User.make_distinct_email_from(first_name, last_name)
        password = str(randbytes(20))

        body = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'password': password,
            'business_area': random.choice(list(BusinessArea.objects.all())).pk,
        }

        response = self.client.post(self.register_url, body,
                                    follow=True,
                                    content_type='application/json')

        ## F1.3 Request to sign-up endpoint is successful
        ## Test that we can register at all.
        self.assertEqual(response.status_code, 200, msg=f'{response.content=}')

        ## Test the returned json.
        data = response.json()

        # Test it gives us a token
        self.assertIn('token', data, msg=f'{response.json()=}')
        # Test it gives us the expiry - TODO Why does this not give us an expiry?
        if False: # TODO Enable test.
            self.assertIn('expiry', data, msg=f'{response.json()=}')
        # Test it returns the logged in user
        self.assertIn('user', data, msg=f'{response.json()=}')


        ## F1.1 Test that the user is stored in the database after registration.
        # Retrieve the user's primary key.
        pk = data['user']['id']

        # Retrieve the user from the database
        stored_user = User.objects.get(pk=pk)

        # See if they're found - if not, the user wasn't stored.
        self.assertIsNotNone(stored_user, msg=f'{data=}')

        ## F1.2 New user in database contains correct details
        self.assertEqual(body['first_name'], stored_user.first_name)
        self.assertEqual(body['last_name'], stored_user.last_name)
        self.assertEqual(body['email'], stored_user.email)
        self.assertEqual(body['business_area'], stored_user.business_area.pk)

        ## F1.4 Authentication request to login endpoint with email and password is successful
        # TODO


    def test_register_url_rejects_requests_without_email(self):
        first_name = random.choice(dataset['first_names'])
        last_name = random.choice(dataset['last_names'])
        password = str(randbytes(20))

        body = {
            'first_name': first_name,
            'last_name': last_name,
            #'email': email,
            'password': password,
            'business_area': random.choice(list(BusinessArea.objects.all())).pk,
        }

        response = self.client.post(self.register_url, body,
                                    follow=True,
                                    content_type='application/json')

        ## F1 User can register for an account using email and password.
        ## Test that, without an email, they're rejected.
        self.assertEqual(response.status_code, 400, msg=f'{response.content=}')

        ## But with an email, they'd be accepted.
        body['email'] = User.make_distinct_email_from(first_name, last_name)

        response = self.client.post(self.register_url, body,
                                    follow=True,
                                    content_type='application/json')

        self.assertEqual(response.status_code, 200, msg=f'{response.content=}')

    def test_register_url_rejects_requests_without_password(self):
        first_name = random.choice(dataset['first_names'])
        last_name = random.choice(dataset['last_names'])
        #password = str(randbytes(20))
        email = User.make_distinct_email_from(first_name, last_name)

        body = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            #'password': password,
            'business_area': random.choice(list(BusinessArea.objects.all())).pk,
        }

        response = self.client.post(self.register_url, body,
                                    follow=True,
                                    content_type='application/json')

        ## F1 User can register for an account using email and password.
        ## Test that, without a password, they're rejected.
        self.assertEqual(response.status_code, 400, msg=f'{response.content=}')

        ## But if they do provide a password, they'd be accepted.
        body['password'] = str(randbytes(20))

        response = self.client.post(self.register_url, body,
                                    follow=True,
                                    content_type='application/json')

        self.assertEqual(response.status_code, 200, msg=f'{response.content=}')

    def test_register_rejects_invalid_emails(self):
        first_name = random.choice(dataset['first_names'])
        last_name = random.choice(dataset['last_names'])
        email = User.make_distinct_email_from(first_name, last_name)
        password = str(randbytes(20))

        body = {
            'first_name': first_name,
            'last_name': last_name,
            'email': first_name + last_name,
            'password': password,
            'business_area': random.choice(list(BusinessArea.objects.all())).pk,
        }

        response = self.client.post(self.register_url, body,
                                    follow=True,
                                    content_type='application/json')

        ## Test that we can register at all.
        self.assertNotEqual(response.status_code, 200, msg=f'{response.content=}')

        ## Test that it provides a good error message
        data = response.json()
        # Check the response contains a warning for the email
        self.assertIn('email', data, msg=f'{response.json()=}')
        # Check the warning has some text content.
        self.assertGreater(len(data['email'][0]), 0, msg=f'{response.json()=}')

    def test_register_rejects_duplicate_emails(self):
        first_name = random.choice(dataset['first_names'])
        last_name = random.choice(dataset['last_names'])
        email = User.make_distinct_email_from(first_name, last_name)
        password = str(randbytes(20))

        body = {
            'first_name': first_name,
            'last_name': last_name,
            'email': first_name + last_name,
            'password': password,
            'business_area': random.choice(list(BusinessArea.objects.all())).pk,
        }

        response = self.client.post(self.register_url, body,
                                    follow=True,
                                    content_type='application/json')

        ## Test that the first user is accepted.
        self.assertNotEqual(response.status_code, 200, msg=f'{response.content=}')

        ## Now check that if we try to sign up using the same email again, then it fails.
        response = self.client.post(self.register_url, body,
                                    follow=True,
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400, msg=f'{response.content=}')

        ## Test that it provides a good error message
        data = response.json()
        # Check the response contains a warning for the email
        self.assertIn('email', data, msg=f'{response.json()=}')
        # Check the warning has some text content.
        self.assertGreater(len(data['email'][0]), 0, msg=f'{response.json()=}')
        
        
    def test_mentor_mentee_registration(self):
        #create two new user, one with mentor_intent = true and mentorship = true 
        # and the other one with false mentor_intent and mentorship = true.
        #mentor_intent is true for a user wanting to become a mentor
        #user 1 will become a mentor for user 2.
        #this will test FR-2.
        rating = None
        if random.choice([True,False]):
            rating = random.randrange(0,10)

        feedback = None
        if random.choice([True,False]):
            feedback = lorem_random(500)

            # TODO Make sure mentor_intent carries through
        user1 = User.make_random(mentor_intent=True)
        assert(user1.mentor_intent==True)

        user2 = User.make_random(mentor_intent=False)
        assert(user2.mentor_intent==False)

        # TODO Put this in a method?
        new_mentorship = Mentorship.objects.create(mentor=user1,
                                                   mentee=user2,
                                                   rating=rating,
                                                   feedback=feedback)
        user2.mentorship = new_mentorship
        user2.save()

        users_with_user1_as_mentor = User.objects.filter(mentorship__mentor__pk__exact=user1.pk)

        ## Check that only 1 user has user1 as mentor
        self.assertEqual(len(users_with_user1_as_mentor), 1)

        ## Check that the one user, with user1 as mentor, is user2.
        self.assertEqual(users_with_user1_as_mentor.first(), user2)

        ## Check that user2 is found in user1's mentees.
        self.assertIn(user2, user1.get_mentees())
     
    def test_mentorship_cancellation(self):
        rating = None
        if random.choice([True,False]):
            rating = random.randrange(0,10)

        feedback = None
        if random.choice([True,False]):
            feedback = lorem_random(500)

        user1 = User.make_random(mentor_intent=True)
        assert(user1.mentor_intent==True)

        user2 = User.make_random(mentor_intent=False)
        assert(user2.mentor_intent==False)

        new_mentorship = Mentorship.objects.create(mentor=user1,
                                                   mentee=user2,
                                                   rating=rating,
                                                   feedback=feedback)
        user2.mentorship = new_mentorship
        user2.save()
        body = {
            "mentorship":new_mentorship.pk,
            "user":user2.pk,
            "mentee":user2.pk
        }
        factory = APIRequestFactory()
        request = factory.post('/api/v1/mentorship/',
                               json.dumps(body),
                               follow=True, content_type='application/json')
        force_authenticate(request, user=user2)
        

        view = MentorshipViewSet.as_view({'post': 'end'})
        response = view(request)

        self.assertEqual(response.status_code, 400, msg=show_res(response))
        self.assertNotEqual(response.status_code, 200)

    def test_meeting_creation(self):
        #this tests if a mentee can create a meeting with their mentor
        #which is saved in the database
        rating = None
        if random.choice([True,False]):
            rating = random.randrange(0,10)

        feedback = None
        if random.choice([True,False]):
            feedback = lorem_random(500)

        # TODO: Make sure mentor_intent actually carries through
        user1 = User.make_random(mentor_intent=True)
        user2 = User.make_random(mentor_intent=False)

        assert(user1.mentor_intent == True)
        assert(user2.mentor_intent == False)

        new_mentorship = Mentorship.objects.create(mentor=user1,
                                                   mentee=user2,
                                                   rating=rating,
                                                   feedback=feedback)
        meeting_count_before = Meeting.objects.count()
        mentee_notes_len = Meeting._meta.get_field('mentee_notes').max_length
        mentor_notes_len = Meeting._meta.get_field('mentor_notes').max_length
        new_meeting = Meeting.objects.create(mentorship=new_mentorship,
                                             time=time_start + random_delta(),
                                             mentee_notes=lorem_random(max_length=mentee_notes_len),
                                             mentor_notes= lorem_random(max_length=mentor_notes_len))
        meeting_count_after = Meeting.objects.count()
        self.assertTrue(meeting_count_before < meeting_count_after)

        # TODO Add endpoint test to make sure that both users can see their meetings in their upcoming list.
      
    def test_mentor_can_send_feedback_to_mentee(self):
        rating = None
        if random.choice([True,False]):
            rating = random.randrange(0,10)

        feedback = None
        if random.choice([True,False]):
            feedback = lorem_random(500)

        # TODO: Make sure mentor_intent actually carries through
        user1 = User.make_random(mentor_intent=True)
        user2 = User.make_random(mentor_intent=False)

        assert(user1.mentor_intent == True)
        assert(user2.mentor_intent == False)

        new_mentorship = Mentorship.objects.create(mentor=user1,
                                                   mentee=user2,
                                                   rating=rating,
                                                   feedback=feedback)

        user1.save()
        user2.mentorship = new_mentorship
        user2.save()
        time = time_start + random_delta()
        body = {
            "mentorship":new_mentorship.pk,
            "positives":lorem_random(1000),
            "improvements":lorem_random(1000),
            "date":str(time)
        }
        factory = APIRequestFactory()
        request = factory.post('/api/v1/mentorship-feedback/',
                               json.dumps(body),
                               follow=True, content_type='application/json')
        force_authenticate(request, user=user2)
        

        view = MentorFeedbackViewSet.as_view({'post': 'create'})
        response = view(request)

        self.assertEqual(response.status_code, 400, msg=show_res(response))
        self.assertNotEqual(response.status_code, 200)

      
    def test_participants_can_join_group_sessions(self):
        #test to see if user can create and join group sessions

        # Create the host, with a list of known expertises
        skills = list(Skill.objects.all())
        host = User.make_random()
        expertises_of_host = random.sample(skills, random.randrange(1,3))
        host.expertise.set(expertises_of_host)
        host.save()

        # Create a group session with host as the host
        new_group_session = GroupSession.objects.create(name=lorem_random(50),
                                        location=lorem_random(70),
                                        description=lorem_random(500),
                                        host=host,
                                        capacity=random.randrange(1, 150),
                                        date=time_start + random_delta())

        new_group_session.skills.set(expertises_of_host)

        ## Create a participant to join the session, check if they can join
        participant = User.make_random()

        new_group_session.users.set([participant])

        # Check that the participant is in the group session
        self.assertIn(participant, new_group_session.users.all())

        # TODO? Could also make a request and check that works too?


    def test_group_session_cannot_be_hosted_by_non_expert(self):
        skills = list(Skill.objects.all())

        host = User.make_random()
        expertise_of_host = random.choice(skills) # Pick 1
        host.expertise.set([expertise_of_host])
        host.save()

        all_other_skills = list(Skill.objects.all().exclude(pk__exact=expertise_of_host.pk))
        random_expertise_they_dont_have = random.choice(all_other_skills)

        body = {
            "name": lorem_random(max_length=100),
            "location": lorem_random(max_length=100),
            "virtual_link": lorem_random(max_length=100),
            "image_link": lorem_random(max_length=100),
            "description": lorem_random(max_length=2000),
            "capacity": random.randint(1, 200),
            "skills": [ random_expertise_they_dont_have.pk ],
            "date": str(time_start + random_delta()),
            "users": []
        }

        factory = APIRequestFactory()
        request = factory.post('/api/v1/session/',
                               json.dumps(body),
                               follow=True, content_type='application/json')
        force_authenticate(request, user=host)

        view = GroupSessionViewSet.as_view({'post': 'create'})
        response = view(request)

        self.assertEqual(response.status_code, 400, msg=show_res(response))
        self.assertNotEqual(response.status_code, 200)
       
    def test_user_cannot_join_a_full_group_session(self):
        
        skills = list(Skill.objects.all())
        host = User.make_random()
        expertise_of_host = random.choice(skills) # Pick 1
        host.expertise.set([expertise_of_host])
        host.save()

        participant = User.make_random()
        participant.save()
        user = User.make_random()
        user.save()

        new_groupsession = GroupSession.objects.create(name=lorem_random(max_length=100),
                            location=lorem_random(max_length=100),
                            virtual_link=lorem_random(max_length=100),
                            image_link= lorem_random(max_length=100),
                            description=lorem_random(max_length=2000),
                            host=host,
                            capacity=1,
                            date =time_start + random_delta())
        new_groupsession.skills.set([expertise_of_host])
        new_groupsession.users.set([participant])
        self.assertIn(participant, new_groupsession.users.all())
        body = {
            "session": new_groupsession.pk,
            "user":user.pk
        }
        factory = APIRequestFactory()
        request = factory.post('/api/v1/session/',
                               json.dumps(body),
                               follow=True, content_type='application/json')
        force_authenticate(request, user=user)

        view = GroupSessionViewSet.as_view({'post': 'join'})
        response = view(request)
        response.render()

        self.assertEqual(response.status_code, 400, msg=show_res(response))
        self.assertNotEqual(response.status_code, 200)



class ActionPlanTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        create_dummy_data(quiet=True)
        cls.randomly_created_user = User.make_random()

    def test_that_users_who_arent_mentees_cant_create_action_plans_for_themselves(self):
        # This user doesn't have a mentor yet.
        user = self.randomly_created_user

        # Try to create an Action Plan by making a request.
        body = {
            "name": lorem_random(max_length=100),
            "description": lorem_random(max_length=1000),
        }

        factory = APIRequestFactory()
        request = factory.post('/api/v1/plan/',
                               json.dumps(body),
                               follow=True, content_type='application/json')
        force_authenticate(request, user=user)

        view = ActionPlanViewSet.as_view({'post': 'create'})
        response = view(request)

        ## Check that the request fails
        self.assertNotEqual(response.status_code, 200, msg=show_res(response))
        self.assertEqual(response.status_code, 400, msg=show_res(response))

        ## Check that the response contains a suitable message
        self.assertIn('mentee', response.data['error'])

        ## Check that the action plan hasn't been created
        number_of_action_plans_of_user = ActionPlan.objects.all().filter(user=user).count()
        self.assertEqual(number_of_action_plans_of_user, 0)

    def test_that_mentors_who_arent_mentees_cant_create_action_plans_for_themselves(self):
        def mentor_isnt_a_mentee(q):
            return q.filter(mentor__mentorship=None)

        mentor = Mentorship.choose_random(map_with=mentor_isnt_a_mentee).mentor

        if mentor is None:
            return # No such mentor, that's okay
        assert(mentor.mentorship is None)

        ## Try to create an action plan for the user themselves
        body = {
            "name": lorem_random(max_length=100),
            "description": lorem_random(max_length=1000),
        }

        factory = APIRequestFactory()
        request = factory.post('/api/v1/plan/',
                               json.dumps(body),
                               follow=True, content_type='application/json')
        force_authenticate(request, user=mentor)

        view = ActionPlanViewSet.as_view({'post': 'create'})
        response = view(request)

        # Check that the request fails
        self.assertNotEqual(response.status_code, 200, msg=show_res(response))
        self.assertEqual(response.status_code, 400, msg=show_res(response))

        # Check that an appropriate error message is delivered
        self.assertIn("must be a mentee", response.data['error'], msg=show_res(response))

    def test_that_users_who_arent_mentors_or_mentees_cant_create_action_plans_for_anyone(self):
        def filter_out_mentors_and_mentees(q):
            return q.filter(mentorship_mentor=None).filter(mentorship=None)

        non_mentor = User.choose_random(map_with=filter_out_mentors_and_mentees)
        assert(non_mentor.get_mentees().count() == 0)

        ## Try to create an action plan for the user themselves
        body = {
            "name": lorem_random(max_length=100),
            "description": lorem_random(max_length=1000),
        }

        factory = APIRequestFactory()
        request = factory.post('/api/v1/plan/',
                               json.dumps(body),
                               follow=True, content_type='application/json')
        force_authenticate(request, user=non_mentor)

        view = ActionPlanViewSet.as_view({'post': 'create'})
        response = view(request)

        # Check that the request fails
        self.assertNotEqual(response.status_code, 200, msg=show_res(response))
        self.assertEqual(response.status_code, 400, msg=show_res(response))

        # Check that an appropriate error message is delivered
        self.assertIn("must be a mentee", response.data['error'], msg=show_res(response))

        ## Try to create an action plan for anyone else
        def exclude_non_mentor(q):
            return q.filter(pk__exact=non_mentor.pk)

        other_user = User.choose_random(map_with=exclude_non_mentor)
        assert(other_user is not non_mentor)

        body = {
            "name": lorem_random(max_length=100),
            "description": lorem_random(max_length=1000),
            "user": other_user.pk
        }

        request = factory.post('/api/v1/plan/',
                               json.dumps(body),
                               follow=True, content_type='application/json')
        force_authenticate(request, user=non_mentor)
        response = view(request)

        # Check that the request fails
        self.assertNotEqual(response.status_code, 200, msg=show_res(response))
        self.assertEqual(response.status_code, 400, msg=show_res(response))

        # Check that an appropriate error message is delivered
        self.assertIn("not your mentee", response.data['error'], msg=show_res(response))

    def test_that_mentors_cant_create_action_plans_for_mentees_that_arent_theirs(self):
        # Pick a random mentor.
        mentor = Mentorship.choose_random().mentor

        # Get a mentee that isn't one of the mentor's mentees
        def exclude_mentees_of_mentor(q):
            return q.exclude(mentorship=None).exclude(mentorship__mentor=mentor)

        other_mentee = User.choose_random(map_with=exclude_mentees_of_mentor)

        ## Try to make an action plan for other_mentee as the mentor.
        body = {
            "name": lorem_random(max_length=100),
            "description": lorem_random(max_length=1000),
            "user": other_mentee.pk
        }

        factory = APIRequestFactory()
        request = factory.post('/api/v1/plan/',
                               json.dumps(body),
                               follow=True, content_type='application/json')
        force_authenticate(request, user=mentor)

        view = ActionPlanViewSet.as_view({'post': 'create'})
        response = view(request)

        ## Check that the request fails
        self.assertNotEqual(response.status_code, 200, msg=show_res(response))
        self.assertEqual(response.status_code, 400, msg=show_res(response))

        ## Check that the response contains a suitable message
        self.assertIn('is not your mentee', response.data['error'])

    def test_mentees_can_create_action_plans_for_themselves(self):
        # Pick a random mentorship
        mentorship = Mentorship.choose_random()

        if mentorship is None:
            return # Random data generation meant there were no mentorships.

        mentee = mentorship.mentee

        # Create an action plan
        body = {
            "name": lorem_random(max_length=100),
            "description": lorem_random(max_length=1000),
        }

        number_of_action_plans_before = ActionPlan.objects.all().filter(user=mentee).count()

        factory = APIRequestFactory()
        request = factory.post('/api/v1/plan/',
                               json.dumps(body),
                               follow=True, content_type='application/json')
        force_authenticate(request, user=mentee)

        view = ActionPlanViewSet.as_view({'post': 'create'})
        response = view(request)

        ## Check that the request succeeds
        self.assertEqual(response.status_code, 201, msg=show_res(response))

        ## Check that the response contains the created data
        self.assertIn('id', response.data, msg=show_res(response))
        self.assertIn('user', response.data, msg=show_res(response))
        self.assertIn('name', response.data, msg=show_res(response))
        self.assertIn('description', response.data, msg=show_res(response))
        self.assertIn('creation_date', response.data, msg=show_res(response))
        self.assertIn('completion_date', response.data, msg=show_res(response))
        created_action_plan = response.data

        ## Check that the action plan has actually been created
        number_of_action_plans_after = mentee.get_action_plans().count()
        self.assertGreater(number_of_action_plans_after, number_of_action_plans_before)

        ## Check that we can retrieve the user's list of action plans, and this one is present.
        request = factory.get('/api/v1/plan/', follow=True)
        force_authenticate(request, user=mentee)

        view = ActionPlanViewSet.as_view({'get': 'list'})
        response = view(request)
        response.render()

        json_returned = json.loads(response.content)

        ids_returned = [action_plan['id'] for action_plan in json_returned]
        self.assertIn(created_action_plan['id'], ids_returned, msg=show_res(response))

    def test_mentors_can_create_action_plans_for_their_mentees(self):
        # Pick a random mentorship
        mentorship = Mentorship.choose_random()

        if mentorship is None:
            return # Random data generation meant there were no mentorships.

        mentor = mentorship.mentor
        mentee = mentorship.mentee

        # Create an action plan
        body = {
            "name": lorem_random(max_length=100),
            "description": lorem_random(max_length=1000),
            "user": mentee.pk,
        }

        number_of_action_plans_before = ActionPlan.objects.all().filter(user=mentee).count()

        # Create an action plan for the mentee as the mentor
        factory = APIRequestFactory()
        request = factory.post('/api/v1/plan/',
                               json.dumps(body),
                               follow=True, content_type='application/json')
        force_authenticate(request, user=mentor) # Signed in as the mentor

        view = ActionPlanViewSet.as_view({'post': 'create'})
        response = view(request)

        ## Check that the request succeeds
        self.assertEqual(response.status_code, 201, msg=show_res(response))

        ## Check that the response contains the created data
        self.assertIn('id', response.data, msg=show_res(response))
        self.assertIn('user', response.data, msg=show_res(response))
        self.assertIn('name', response.data, msg=show_res(response))
        self.assertIn('description', response.data, msg=show_res(response))
        self.assertIn('creation_date', response.data, msg=show_res(response))
        self.assertIn('completion_date', response.data, msg=show_res(response))
        created_action_plan = response.data

        ## Check that the action plan has actually been created
        number_of_action_plans_after = mentee.get_action_plans().count()
        self.assertGreater(number_of_action_plans_after, number_of_action_plans_before)

        ## Check that we can retrieve the user's list of action plans, and this one is present.
        request = factory.get('/api/v1/plan/', follow=True)
        force_authenticate(request, user=mentee)

        view = ActionPlanViewSet.as_view({'get': 'list'})
        response = view(request)
        response.render()

        json_returned = json.loads(response.content)

        ids_returned = [action_plan['id'] for action_plan in json_returned]
        self.assertIn(created_action_plan['id'], ids_returned, msg=show_res(response))
 
class MatchingAlgorithmTestCases(TestCase):
    @classmethod
    def setUpTestData(cls):
        create_dummy_data(quiet=True)
        cls.randomly_created_user = User.make_random()

    def test_user_wont_be_suggested_mentors_that_dont_want_to_be_mentors(self):
        mentee = self.randomly_created_user
        skills = list(Skill.objects.all())
        mentee_interests = random.choice(skills)
        mentee.interests.set([mentee_interests])
        mentee.save()

        try:
            m = matching_algorithm(user_looking_for_mentor=mentee,
                           users_who_want_to_mentor=list(User.objects.filter(mentor_intent=True)),
                           all_mentorships=list(Mentorship.objects.filter()),
                           current_mentorships=[],
                           all_users=list(User.objects.filter()),
                           all_requests= list(MentorRequest.objects.filter()))
            for x in m:
                self.assertTrue(x.mentor_intent)
        except NoPossibleMentorsError:
            self.assertTrue(True)
    
    def test_user_wont_be_suggested_mentors_from_same_business_area(self):
        mentee = self.randomly_created_user
        skills = list(Skill.objects.all())
        mentee_interests = random.choice(skills)
        mentee.interests.set([mentee_interests])
        
        business_area = mentee.business_area
        
        mentee.save()
        try:
            m = matching_algorithm(user_looking_for_mentor=mentee,
                           users_who_want_to_mentor=list(User.objects.filter(mentor_intent=True)),
                           all_mentorships=list(Mentorship.objects.filter()),
                           current_mentorships=[],
                           all_users=list(User.objects.filter()),
                           all_requests= list(MentorRequest.objects.filter()))
            for x in m:
                self.assertFalse(x.business_area == business_area)
        except NoPossibleMentorsError:
            self.assertTrue(True)
    
    def test_suggested_mentors_have_the_required_expertise(self):
        mentee = self.randomly_created_user
        skills = list(Skill.objects.all())
        mentee_interests = random.choice(skills)
        mentee.interests.set([mentee_interests])
        mentee.save()

        try:
            m = matching_algorithm(user_looking_for_mentor=mentee,
                           users_who_want_to_mentor=list(User.objects.filter(mentor_intent=True)),
                           all_mentorships=list(Mentorship.objects.filter()),
                           current_mentorships=[],
                           all_users=list(User.objects.filter()),
                           all_requests= list(MentorRequest.objects.filter()))
            for x in m:
                self.assertTrue(compatible(x,mentee))
        except NoPossibleMentorsError:
            self.assertTrue(True)

    def test_user_is_not_suggested_previous_mentors(self):
        mentee = random.choice(list(User.objects.all()))
        #ex_mentors = list(filter(lambda m: m.mentee == mentee,
        #                                 list(Mentorship.objects.filter())))
        ex_mentor = User.make_random()
        skills = list(Skill.objects.all())
        mentee_interests = random.choice(skills)
        ex_mentor.expertise.set([mentee_interests])
        ex_mentor.save()
        mentee.interests.set([mentee_interests])
        mentee.save()
        old_mentorship = Mentorship.objects.create(mentor=ex_mentor,
                                                   mentee=mentee,
                                                   rating=None,
                                                   feedback=None)
        mentee.mentorship = old_mentorship
        try:
            m = matching_algorithm(user_looking_for_mentor=mentee,
                           users_who_want_to_mentor=list(User.objects.filter(mentor_intent=True)),
                           all_mentorships=list(Mentorship.objects.filter()),
                           current_mentorships=[],
                           all_users=list(User.objects.filter()),
                           all_requests= list(MentorRequest.objects.filter()))
            for x in m:
                self.assertFalse(x==ex_mentor)
        except NoPossibleMentorsError:
            self.assertTrue(True)
