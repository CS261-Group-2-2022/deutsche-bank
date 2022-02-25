from django.contrib import admin

# Register your models here.
from apis.models import *

admin.site.register(Skill)
admin.site.register(BusinessArea)
admin.site.register(Mentorship)
admin.site.register(Request)
admin.site.register(User)
admin.site.register(Meeting)
admin.site.register(ActionPlan)
admin.site.register(Notification)
admin.site.register(GroupSession)