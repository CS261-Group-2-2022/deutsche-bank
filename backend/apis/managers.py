from datetime import datetime
from enum import unique, Enum, auto

from django.contrib.auth.base_user import BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


@unique
class NotificationType(Enum):
    BUSINESS_AREA_CONFLICT_MENTEE = 1
    MEETING_REQUEST_RECEIVED = 2
    MEETING_NOTES_MENTOR = 3
    MEETING_NOTES_MENTEE = 4
    MENTORSHIP_REQUEST_RECEIVED = 5
    GROUP_SESSION_PROMPT = 6

    MENTORSHIP_REQUEST_ACCEPTED = 7
    MENTORSHIP_REQUEST_DECLINED = 8
    MEETING_REQUEST_ACCEPTED = 9
    MEETING_REQUEST_DECLINED = 10

    BUSINESS_AREA_CONFLICT_MENTOR = 11
    MEETING_CANCELLED_MENTOR = 12
    MEETING_CANCELLED_MENTEE = 13

    ACTION_PLAN_CREATED_MENTEE = 14
    ACTION_PLAN_CREATED_MENTOR = 15
    ACTION_PLAN_COMPLETED_MENTEE = 16
    ACTION_PLAN_COMPLETED_MENTOR = 17


class NotificationManager(models.Manager):
    def create(self, type_enum, **kwargs):
        notification = self.model(type=type_enum.value, **kwargs)
        notification.save(using=self._db)
        return notification

    def business_area_conflict_mentee(self, mentorship):  # TODO: Send notification, delete after acted on
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.BUSINESS_AREA_CONFLICT_MENTEE,
                    user=mentee,
                    title=f'Your business area is the same as {mentor.get_full_name()}',
                    action={'mentor': mentor.pk})

    def business_area_conflict_mentor(self, mentorship):  # TODO: Send notification, delete after acted on
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.BUSINESS_AREA_CONFLICT_MENTOR,
                    user=mentor,
                    title=f'Your business area is the same as {mentee.get_full_name()}',
                    action={'mentee': mentee.pk})

    def meeting_request_received(self, meeting_request):
        mentorship = meeting_request.mentorship
        time = meeting_request.time
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.MEETING_REQUEST_RECEIVED,
                    user=mentor,
                    title=f'Received a meeting request from {mentee.get_full_name()}',
                    action={'request': meeting_request.pk, 'mentee': mentee.pk},
                    info={'time': time.isoformat()})

    def meeting_notes_mentor(self, meeting):  # TODO: Send notification, delete after acted on
        mentorship = meeting.mentorship
        time = meeting.time
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.MEETING_NOTES_MENTOR,
                    user=mentee,
                    title=f'Notes have not been recorded for your meeting with {mentor.get_full_name()}',
                    action={'meeting': meeting.pk},
                    info={'time': time.isoformat()})

    def meeting_notes_mentee(self, meeting):  # TODO: Send notification, delete after acted on
        mentorship = meeting.mentorship
        time = meeting.time
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.MEETING_NOTES_MENTEE,
                    user=mentor,
                    title=f'Notes have not been recorded for your meeting with {mentee.get_full_name()}',
                    action={'mentee': mentee.pk, 'meeting': meeting.pk},
                    info={'time': time.isoformat()})

    def mentorship_request_received(self, mentor_request):
        mentee = mentor_request.mentee
        mentor = mentor_request.mentor
        self.create(NotificationType.MENTORSHIP_REQUEST_RECEIVED,
                    user=mentor,
                    title=f'{mentee.get_full_name()} requested to be your mentee',
                    action={'request': mentor_request.pk})

    def mentorship_request_accepted(self, mentor_request):
        mentee = mentor_request.mentee
        mentor = mentor_request.mentor
        self.create(NotificationType.MENTORSHIP_REQUEST_ACCEPTED,
                    user=mentee,
                    title=f'{mentor.get_full_name()} accepted your request to mentor you')

    def mentorship_request_declined(self, mentor_request):
        mentee = mentor_request.mentee
        mentor = mentor_request.mentor
        self.create(NotificationType.MENTORSHIP_REQUEST_DECLINED,
                    user=mentee,
                    title=f'{mentor.get_full_name()} declined your request to mentor you')

    def meeting_request_accepted(self, meeting_request):
        mentorship = meeting_request.mentorship
        time = meeting_request.time
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.MEETING_REQUEST_ACCEPTED,
                    user=mentee,
                    title=f'{mentor.get_full_name()} accepted your meeting request',
                    info={'time': time.isoformat()})

    def meeting_request_declined(self, meeting_request):
        mentorship = meeting_request.mentorship
        time = meeting_request.time
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.MEETING_REQUEST_DECLINED,
                    user=mentee,
                    title=f'{mentor.get_full_name()} declined your meeting request',
                    info={'time': time.isoformat()})

    def meeting_cancelled_mentee(self, meeting):
        mentorship = meeting.mentorship
        time = meeting.time
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.MEETING_CANCELLED_MENTEE,
                    user=mentor,
                    title=f'{mentee.get_full_name()} cancelled your meeting',
                    info={'time': time.isoformat()})

    def meeting_cancelled_mentor(self, meeting):
        mentorship = meeting.mentorship
        time = meeting.time
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.MEETING_CANCELLED_MENTOR,
                    user=mentee,
                    title=f'{mentor.get_full_name()} cancelled your meeting',
                    info={'time': time.isoformat()})

    def action_plan_created_mentee(self, action_plan):
        mentee = action_plan.user
        mentorship = mentee.mentorship
        mentor = mentorship.mentor
        self.create(NotificationType.ACTION_PLAN_CREATED_MENTEE,
                    user=mentor,
                    title=f'{mentee.get_full_name()} created a {action_plan.name} action plan')

    def action_plan_created_mentor(self, action_plan):
        mentee = action_plan.user
        mentorship = mentee.mentorship
        mentor = mentorship.mentor
        self.create(NotificationType.ACTION_PLAN_CREATED_MENTOR,
                    user=mentee,
                    title=f'{mentor.get_full_name()} created a {action_plan.name} action plan')

    def action_plan_completed_mentee(self, action_plan):
        mentee = action_plan.user
        mentorship = mentee.mentorship
        mentor = mentorship.mentor
        self.create(NotificationType.ACTION_PLAN_COMPLETED_MENTEE,
                    user=mentor,
                    title=f'{mentee.get_full_name()} marked their {action_plan.name} action plan as completed')

    def action_plan_completed_mentor(self, action_plan):
        mentee = action_plan.user
        mentorship = mentee.mentorship
        mentor = mentorship.mentor
        self.create(NotificationType.ACTION_PLAN_COMPLETED_MENTOR,
                    user=mentee,
                    title=f'{mentor.get_full_name()} marked their {action_plan.name} action plan as completed')
