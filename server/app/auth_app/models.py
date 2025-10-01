from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import CustomUserManager
from django.core.exceptions import ValidationError
from django.conf import settings
from typing import TypedDict, List


def service_name_validator(values:dict):

    if not isinstance(values, dict):
        raise ValidationError('Value must be a list of service names.')
    if "service_names" not in values:
        raise ValidationError('Must include "service_names" key.')
    services = settings.ALLOWED_SERVICES
    for v in values["service_names"]:
        if v not in services:
            raise ValidationError('Invalid service name.')

class ServicesValue(TypedDict):
    service_names: List[str]
    last_userd_service: str

class User(AbstractBaseUser, PermissionsMixin):
    def __str__(self):
        return self.email

    email = models.EmailField(unique=True)
    google_access_token = models.TextField(
        verbose_name="Google API access token", max_length=255, default=None, null=True, blank=True
    )
    google_refresh_token = models.TextField(
        verbose_name="Google API refresh token", max_length=255, default=None, null=True, blank=True
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    def get_default_services():
        return {"service_names": [], "last_used_service": ""}
    services: ServicesValue = models.JSONField(validators=[service_name_validator], default=get_default_services)
    REQUIRED_FIELDS = []
    USERNAME_FIELD = "email"
    objects = CustomUserManager()

    def add_service(self, service):
        '''Add a service name to the list of services used by the user. Available services are listed in settigs under ALLOWED_SERVICES.'''
        if service not in self.services["service_names"]:
            self.services['service_names'].append(service)

        self.services.update({"last_used_service": service})
        self.clean_fields()
        self.save()


