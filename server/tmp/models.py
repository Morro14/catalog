from typing import Any
from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager, Group
from datetime import datetime

from PIL import Image
import io
import os


# Create your models here.
class DataEntry(models.Model):
    def __str__(self) -> str:
        return f"{self.type} {self.pk}"

    title = models.CharField(max_length=64, default="")
    type = models.ForeignKey(to="DataType", on_delete=models.CASCADE)
    tags = models.ManyToManyField(to="DataTag")
    date = models.DateField(blank=True)
    create_time = models.DateTimeField()
    file_realid = models.CharField(max_length=64, default="")
    file = models.FileField(
        null=True, default=None, blank=True, upload_to="static/uploads"
    )
    thumbnail = models.CharField(default=None, null=True, max_length=64)

    class Meta:
        verbose_name = "Данные"
        verbose_name_plural = "Данные"

    def save(self):

        self.create_time = datetime.now()
        # file = download_file(self.file_realid)
        # print(type(file))
        # image = Image.open(io.BytesIO(file))
        # image.save(f"static/uploads/IMG_{self.file_realid}.jpeg")
        # self.file.name = f"static/uploads/IMG_{self.file_realid}.jpeg"
        # self.file = file
        super().save()


class DataType(models.Model):
    def __str__(self) -> str:
        return self.name

    name = models.CharField(unique=True, max_length=255)

    class Meta:
        verbose_name = "Тип данных"
        verbose_name_plural = "Типы данных"


class DataTag(models.Model):
    def __str__(self) -> str:
        return self.name

    name = models.CharField(unique=True, max_length=255)

    class Meta:
        verbose_name = "Метка"
        verbose_name_plural = "Метки"


class MyUser(AbstractUser):
    pass


class CustomUserManager(UserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        if email:
            email = self.normalize_email(email)
        user = self.model(username=username, **extra_fields)
        user.password = password
        user.save()
        user_group = Group.objects.get_or_create(name="user_group")
        user.groups.add(user_group)
        return user
