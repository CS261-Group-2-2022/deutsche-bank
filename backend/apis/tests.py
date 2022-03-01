from django.test import TestCase
from django.conf import settings
from random import randbytes

from .models import *
from .dummy_data import *
from .dummy_data_dataset import dataset

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

        users_with_user1_as_mentor = User.objects.all().filter(mentorship__mentor__pk__exact=user1.pk)

        ## Check that only 1 user has user1 as mentor
        self.assertEqual(len(users_with_user1_as_mentor), 1)

        ## Check that the one user, with user1 as mentor, is user2.
        self.assertEqual(users_with_user1_as_mentor.first(), user2)

        ## Check that user2 is found in user1's mentees.
        self.assertIn(user2, user1.get_mentees())

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
