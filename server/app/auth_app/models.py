from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager


class User(AbstractUser):
    def __str__(self):
        return self.email

    email = models.EmailField(unique=True)
    google_access_token = models.TextField(
        verbose_name="Google API access token", max_length=255, default=None, null=True
    )
    google_refresh_token = models.TextField(
        verbose_name="Google API refresh token", max_length=255, default=None, null=True
    )
    REQUIRED_FIELDS = []
    USERNAME_FIELD = "email"
    username = None
    objects = CustomUserManager()
