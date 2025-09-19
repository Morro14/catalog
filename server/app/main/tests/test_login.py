from django.test import TestCase as TestCaseDj
from main.models import Node, Folder, Entry, Category, Tag
from django.contrib.auth import get_user_model
from auth_app.utils.jwt_ import CustomJWTTest
from django.core.management import call_command

USER = get_user_model()


class PopulateDataTest(TestCaseDj):
    def setUp(self):
        DEPTH = 3
        FOLDERS = 9
        ENTRIES = 15
        USERS = 2
        call_command("seed", users=USERS, entries=ENTRIES, folders=FOLDERS, depth=DEPTH)


class LoginTest(TestCaseDj):
    def setUp(self):
        USER.objects.create(email="test@email.com", password="password123")

    def test_login(self):
        email = "test@email.com"
        password = "password123"
        response = self.client.post(
            "http://127.0.0.1:8000/auth/login",
            data={"email": email, "password": password},
        )
        print(response.json())
