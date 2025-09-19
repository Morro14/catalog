from django.test import TestCase as TestCaseDj
from rest_framework.test import APIClient, APITestCase
from ..models import Node, Folder, Entry, Category, Tag
from django.contrib.auth import get_user_model
from django.core.management import call_command


USER = get_user_model()


class TreeTest(APITestCase):
    def setUp(self):
        DEPTH = 3
        FOLDERS = 9
        ENTRIES = 15
        USERS = 2

        call_command("seed", users=USERS, entries=ENTRIES, folders=FOLDERS, depth=DEPTH)

    def test_paths(self):
        nodes = Node.objects.all()
        node_paths = [n.path for n in nodes]
        print(node_paths)


class FolderUniqueNameTest(TestCaseDj):
    def setUp(self):

        user = USER.objects.create(email="test@email.com", password="1234dofwe")
        root = Folder.objects.create(root=True, name="root", user=user)
        folder_1 = Folder.objects.create(name="Folder 1", parent=root, user=user)
        category = Category.objects.create(name="Category 1")
        Entry.objects.create(name="Entry 1", parent=root, category=category, user=user)
        Entry.objects.create(
            name="Entry 2", parent=folder_1, category=category, user=user
        )

    def test_unique_name(self):
        user = USER.objects.get(email="test@email.com")
        root = Folder.objects.filter(root=True).first()
        entry = Entry.objects.get(name="Entry 1")
        # folder1 = Folder.objects.get(name="Folder 1")
        category = Category.objects.get(name="Category 1")
        Entry.objects.create(name="Entry 2", parent=root, category=category, user=user)
