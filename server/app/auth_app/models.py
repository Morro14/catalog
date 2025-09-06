from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import CustomUserManager


class User(AbstractBaseUser, PermissionsMixin):
    def __str__(self):
        return self.email

    email = models.EmailField(unique=True)
    google_access_token = models.TextField(
        verbose_name="Google API access token", max_length=255, default=None, null=True
    )
    google_refresh_token = models.TextField(
        verbose_name="Google API refresh token", max_length=255, default=None, null=True
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    REQUIRED_FIELDS = []
    USERNAME_FIELD = "email"
    objects = CustomUserManager()
