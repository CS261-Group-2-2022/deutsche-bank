from __future__ import annotations

import random
from datetime import datetime
from enum import unique, Enum
from typing import Iterable

from django.conf import settings
from django.contrib.auth.base_user import BaseUserManager
from django.db import models as django_models
from django.db.models.query import QuerySet
from . import models as apis_models


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


class NotificationManager(django_models.Manager):
    def create(self, type_enum, **kwargs):
        notification = self.model(type=type_enum.value, **kwargs)
        notification.save(using=self._db)
        return notification

    def delete_business_area_conflict(self, mentorship: apis_models.Mentorship):
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.filter(type=NotificationType.BUSINESS_AREA_CONFLICT_MENTEE.value, user=mentor,
                    action__mentee=mentee.pk).delete()
        self.filter(type=NotificationType.BUSINESS_AREA_CONFLICT_MENTOR.value, user=mentee,
                    action__mentor=mentor.pk).delete()

    def business_area_conflict(self, mentorship: apis_models.Mentorship):
        mentee = mentorship.mentee
        if mentee.mentorship != mentorship:
            return
        mentor = mentorship.mentor
        self.create(NotificationType.BUSINESS_AREA_CONFLICT_MENTEE,
                    user=mentor,
                    title=f'Your business area is the same as {mentee.get_full_name()}',
                    action={'mentee': mentee.pk})

        self.create(NotificationType.BUSINESS_AREA_CONFLICT_MENTOR,
                    user=mentee,
                    title=f'Your business area is the same as {mentor.get_full_name()}',
                    action={'mentor': mentor.pk})

    def meeting_request_received(self, meeting_request: apis_models.MeetingRequest):
        mentorship = meeting_request.mentorship
        time = meeting_request.time
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.MEETING_REQUEST_RECEIVED,
                    user=mentor,
                    title=f'Received a meeting request from {mentee.get_full_name()}',
                    action={'request': meeting_request.pk, 'mentee': mentee.pk},
                    info={'time': time.isoformat()})

    def meeting_notes_mentor(self, meeting: apis_models.Meeting):  # TODO: Send notification, delete after acted on
        mentorship = meeting.mentorship
        time = meeting.time
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.MEETING_NOTES_MENTOR,
                    user=mentee,
                    title=f'Notes have not been recorded for your meeting with {mentor.get_full_name()}',
                    action={'meeting': meeting.pk},
                    info={'time': time.isoformat()})

    def meeting_notes_mentee(self, meeting: apis_models.Meeting):  # TODO: Send notification, delete after acted on
        mentorship = meeting.mentorship
        time = meeting.time
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.MEETING_NOTES_MENTEE,
                    user=mentor,
                    title=f'Notes have not been recorded for your meeting with {mentee.get_full_name()}',
                    action={'mentee': mentee.pk, 'meeting': meeting.pk},
                    info={'time': time.isoformat()})

    def mentorship_request_received(self, mentor_request: apis_models.MentorRequest):
        mentee = mentor_request.mentee
        mentor = mentor_request.mentor
        self.create(NotificationType.MENTORSHIP_REQUEST_RECEIVED,
                    user=mentor,
                    title=f'{mentee.get_full_name()} requested to be your mentee',
                    action={'request': mentor_request.pk})

    def mentorship_request_accepted(self, mentor_request: apis_models.MentorRequest):
        mentee = mentor_request.mentee
        mentor = mentor_request.mentor
        self.create(NotificationType.MENTORSHIP_REQUEST_ACCEPTED,
                    user=mentee,
                    title=f'{mentor.get_full_name()} accepted your request to mentor you')

    def mentorship_request_declined(self, mentor_request: apis_models.MentorRequest):
        mentee = mentor_request.mentee
        mentor = mentor_request.mentor
        self.create(NotificationType.MENTORSHIP_REQUEST_DECLINED,
                    user=mentee,
                    title=f'{mentor.get_full_name()} declined your request to mentor you')

    def meeting_request_accepted(self, meeting_request: apis_models.MeetingRequest):
        mentorship = meeting_request.mentorship
        time = meeting_request.time
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.MEETING_REQUEST_ACCEPTED,
                    user=mentee,
                    title=f'{mentor.get_full_name()} accepted your meeting request',
                    info={'time': time.isoformat()})

    def meeting_request_declined(self, meeting_request: apis_models.MeetingRequest):
        mentorship = meeting_request.mentorship
        time = meeting_request.time
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.MEETING_REQUEST_DECLINED,
                    user=mentee,
                    title=f'{mentor.get_full_name()} declined your meeting request',
                    info={'time': time.isoformat()})

    def meeting_cancelled_mentee(self, meeting: apis_models.Meeting):
        mentorship = meeting.mentorship
        time = meeting.time
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.MEETING_CANCELLED_MENTEE,
                    user=mentor,
                    title=f'{mentee.get_full_name()} cancelled your meeting',
                    info={'time': time.isoformat()})

    def meeting_cancelled_mentor(self, meeting: apis_models.Meeting):
        mentorship = meeting.mentorship
        time = meeting.time
        mentee = mentorship.mentee
        mentor = mentorship.mentor
        self.create(NotificationType.MEETING_CANCELLED_MENTOR,
                    user=mentee,
                    title=f'{mentor.get_full_name()} cancelled your meeting',
                    info={'time': time.isoformat()})

    def action_plan_created_mentee(self, action_plan: apis_models.ActionPlan):
        mentee = action_plan.user
        mentorship = mentee.mentorship
        mentor = mentorship.mentor
        self.create(NotificationType.ACTION_PLAN_CREATED_MENTEE,
                    user=mentor,
                    title=f'{mentee.get_full_name()} created a {action_plan.name} action plan')

    def action_plan_created_mentor(self, action_plan: apis_models.ActionPlan):
        mentee = action_plan.user
        mentorship = mentee.mentorship
        mentor = mentorship.mentor
        self.create(NotificationType.ACTION_PLAN_CREATED_MENTOR,
                    user=mentee,
                    title=f'{mentor.get_full_name()} created a {action_plan.name} action plan')

    def action_plan_completed_mentee(self, action_plan: apis_models.ActionPlan):
        mentee = action_plan.user
        mentorship = mentee.mentorship
        mentor = mentorship.mentor
        self.create(NotificationType.ACTION_PLAN_COMPLETED_MENTEE,
                    user=mentor,
                    title=f'{mentee.get_full_name()} marked their {action_plan.name} action plan as completed')

    def action_plan_completed_mentor(self, action_plan: apis_models.ActionPlan):
        mentee = action_plan.user
        mentorship = mentee.mentorship
        mentor = mentorship.mentor
        self.create(NotificationType.ACTION_PLAN_COMPLETED_MENTOR,
                    user=mentee,
                    title=f'{mentor.get_full_name()} marked your {action_plan.name} action plan as completed')

    def send_group_session_prompts(self, users_per_notification=25):
        """
        Sends the group session prompts
        :param users_per_notification: The number of interested users for a skill in order for a notification to be sent
        """
        for skill in apis_models.Skill.objects.all():
            interested = apis_models.User.objects.filter(interests__pk__contains=skill.pk).count()
            notification_set: QuerySet[apis_models.Notification] = self.filter(
                type=NotificationType.GROUP_SESSION_PROMPT.value, info__skill__exact=skill.pk)
            notifications = notification_set.count()
            notification_users = map(lambda n: n.user.pk, notification_set)

            sessions = 0
            for session in apis_models.GroupSession.objects.filter(date__gt=datetime.now(tz=settings.TIME_ZONE_INFO),
                                                                   skills__pk__contains=skill.pk):
                session_user_count = session.users.count()
                if session_user_count >= session.capacity:
                    continue
                sessions += session.capacity - session_user_count
            target = sessions + (notifications * users_per_notification)
            required = (interested - target) / users_per_notification
            # print(f'{skill.name}: Notifications({notifications}) Sessions({sessions}) Interested({interested})')
            if required <= 0:
                # Avoid sending out notifications if lots have been sent out or sessions are already organised
                continue

            experts: [apis_models.User] = list(apis_models.User.objects.filter(
                expertise__pk__contains=skill.pk, group_prompt_intent__exact=True).exclude(pk__in=notification_users))
            if len(experts) > required:
                experts = random.sample(experts, int(required))
            for expert in experts:
                self.group_session_prompt(expert, skill)

    # JSON contains lookup is not supported on our database, hence only a single skill is passed
    def group_session_prompt(self, user, skill: apis_models.Skill):
        # print(f'Sending group session prompt to {user.get_full_name()}')
        self.create(NotificationType.GROUP_SESSION_PROMPT,
                    user=user,
                    title=f'There is demand for a group session on {skill.name}',
                    info={'skill': skill.pk})
