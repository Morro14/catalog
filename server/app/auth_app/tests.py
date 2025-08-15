import requests
from django.test import TestCase as TestCaseDj
from django.contrib.auth import get_user_model
from .utils.jwt_ import CustomJWT
import os
from dotenv import load_dotenv
from .loggers import UserLogger
from django_rest_passwordreset.models import ResetPasswordToken
from unittest import TestCase


logger = UserLogger("users.log")

load_dotenv()

USER_MODEL = get_user_model()
URL_BASE = "http://127.0.0.1:8000/auth/"


class AuthTest(TestCaseDj):
    def test_register(self):
        r = requests.post(
            "http://127.0.0.1:8000/auth/register",
            data={"email": "email2@test.com", "password": "qwer"},
        )

        print(r.content)

    def test_login(self):
        r = requests.post(
            url=URL_BASE + "login",
            data={"email": "email2@test.com", "password": "qwer"},
        )
        print(r.content)

    def test_logout(self):
        jwt = CustomJWT(os.environ.get("JWT_SECRET")).get_token()

        r = requests.get(cookies={"jwt": jwt}, url=URL_BASE + "logout")
        print(r.cookies.get("jwt"), r.content)


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
