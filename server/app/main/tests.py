from django.test import TestCase as TestCaseDj
from .models import Node, Folder, Entry, Category, Tag
from django.contrib.auth import get_user_model
from auth_app.utils.jwt_ import CustomJWTTest
from django.core.management import call_command
from faker import Faker

USER = get_user_model()
fake = Faker()


class CurrentTest(TestCaseDj):
    def setUp(self):

        DEPTH = 3
        FOLDERS = 9
        ENTRIES = 15
        USERS = 2

        call_command("seed", users=USERS, entries=ENTRIES, folders=FOLDERS, depth=DEPTH)
