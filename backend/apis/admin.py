from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(Skill)
admin.site.register(BusinessArea)
admin.site.register(Mentorship)
admin.site.register(MentorRequest)
admin.site.register(User)
admin.site.register(Meeting)
admin.site.register(MeetingRequest)
admin.site.register(ActionPlan)
admin.site.register(Notification)
admin.site.register(GroupSession)
admin.site.register(Feedback)
