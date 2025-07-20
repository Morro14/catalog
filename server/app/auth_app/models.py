from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager


class User(AbstractUser):
    def __str__(self):
        return self.email

    email = models.EmailField(unique=True)
    # password = models.CharField(max_length=255)

    REQUIRED_FIELDS = []
    USERNAME_FIELD = "email"
    username = None
    objects = CustomUserManager()
