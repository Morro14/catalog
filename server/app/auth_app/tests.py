import requests
from django.test import TestCase as TestCaseDj
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .utils.jwt_ import CustomJWT
import os
from dotenv import load_dotenv
from .loggers import UserLogger
from django_rest_passwordreset.models import ResetPasswordToken
from unittest import TestCase
from auth_app.utils.jwt_ import CustomJWTTest

logger = UserLogger("users.log")

load_dotenv()

USER_MODEL = get_user_model()
URL_BASE = "http://127.0.0.1:8000/auth/"


class ServiceValidateTest(TestCaseDj):
    def test_validate(self):
        user = USER_MODEL.objects.create_user(email='test@email.com', password="password123")
        user.add_service('google')
        print(user.services)

class UserInfoTest(APITestCase):
    def test_get_info(self):
        user = USER_MODEL.objects.create_user(email='test@email.com', password="password123")
        user.add_service('google')
        user_token = CustomJWTTest(
            content={"id": str(user.id)},
        ).get_token()
        self.client.cookies["jwt"] = user_token
        response = self.client.get(path='http://127.0.0.1:8000/api-v1/catalog/user-service-info')
        print('test response',response.json())

class PassResetTest(TestCase):

    def test_password_reset(self):
        user = USER_MODEL.objects.get(email="ivfmn1@gmail.com")
        print(user)
        r = requests.post(
            URL_BASE + "password-reset/", data={"email": "ivfmn1@gmail.com"}
        )
        print(r.status_code)

    def test_password_reset_confirm(self):
        r = requests.post(
            URL_BASE + "password-reset/", data={"email": "ivfmn1@gmail.com"}
        )
        user = USER_MODEL.objects.get(email="ivfmn1@gmail.com")
        logger.log(f"User {user} is trying to get password reset confirmation.")
        tokens = ResetPasswordToken.objects.all()
        print("token:", tokens[0].key)

        new_password = "p0feoMkedrwnbi"
        r = requests.post(
            URL_BASE + "password-reset/confirm/",
            data={"token": tokens[0].key, "password": new_password},
        )

        print(r.text)
        print("new pass:", user.password)
