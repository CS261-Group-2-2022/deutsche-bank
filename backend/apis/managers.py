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


class NotificationManager(models.Manager):
    def create(self, type_enum, **kwargs):
        notification = self.model(type=type_enum.value, **kwargs)
        notification.save(using=self._db)
        return notification

    def business_area_conflict_mentee(self, mentorship):  # TODO: Send notification
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.BUSINESS_AREA_CONFLICT_MENTEE,
                    user=mentee,
                    title=f'Your business area is the same as {mentor.get_full_name()}',
                    action={'mentor': mentor.pk})

    def business_area_conflict_mentor(self, mentorship):  # TODO: Send notification
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.BUSINESS_AREA_CONFLICT_MENTOR,
                    user=mentor,
                    title=f'Your business area is the same as {mentee.get_full_name()}',
                    action={'mentee': mentee.pk})

    def meeting_request_received(self, meeting_request):
        mentorship = meeting_request.mentorship
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.MEETING_REQUEST_RECEIVED,
                    user=mentor,
                    title=f'Received a meeting request from {mentee.get_full_name()}',
                    action={'mentee': mentee.pk})

    def meeting_notes_mentor(self, meeting):  # TODO: Send notification
        mentorship = meeting.mentorship
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.MEETING_NOTES_MENTOR,
                    user=mentee,
                    title=f'Notes have not been recorded for your meeting with {mentor.get_full_name()} on {meeting.time.strftime("%d/%m")}',
                    action={'meeting': meeting.pk})

    def meeting_notes_mentee(self, meeting):  # TODO: Send notification
        mentorship = meeting.mentorship
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.MEETING_NOTES_MENTEE,
                    user=mentor,
                    title=f'Notes have not been recorded for your meeting with {mentee.get_full_name()} on {meeting.time.strftime("%d/%m")}',
                    action={'mentee': mentee.pk, 'meeting': meeting.pk})

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
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.MEETING_REQUEST_ACCEPTED,
                    user=mentee,
                    title=f'{mentor.get_full_name()} accepted your meeting request')

    def meeting_request_declined(self, meeting_request):
        mentorship = meeting_request.mentorship
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.MEETING_REQUEST_DECLINED,
                    user=mentee,
                    title=f'{mentor.get_full_name()} accepted your meeting request')
