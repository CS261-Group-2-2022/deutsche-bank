from django.db import models

# Create your models here.

class StuffModel(models.Model):
    title = models.CharField(max_length = 255)

    def __str__(self):
        return self.title

StuffModel.objects.create(title = "The First Group")
StuffModel.objects.create(title = "The Second Group")


class User(models.Model):
    first_name = models.CharField(max_length = 100)
    last_name = models.CharField(max_length = 100)

    email = models.CharField(max_length = 100)
    is_email_verified = models.BooleanField()

    password = models.CharField(max_length = 100) # TODO(arwck)

    is_mentor = models.BooleanField()
    is_mentee = models.BooleanField()
