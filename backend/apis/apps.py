from django.apps import AppConfig
from .scheduler import background_scheduler
import schedule


class ApisConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apis'

    def ready(self):
        background_scheduler()
        from .models import Notification
        schedule.every(5).minutes.do(Notification.objects.send_group_session_prompts)
        super().ready()
