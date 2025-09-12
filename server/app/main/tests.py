from django.test import TestCase as TestCaseDj
from rest_framework.test import APIClient, APITestCase
from .models import Node, Folder, Entry, Category, Tag
from django.contrib.auth import get_user_model
from .exceptions import NameDublicateException
from auth_app.utils.jwt_ import CustomJWTTest

USER = get_user_model()

import random
from faker import Faker
from datetime import datetime


fake = Faker()


def gen_random_datetime(start: datetime, end: datetime):
    delta = end - start
    random_seconds = delta * random.random()
    return start + random_seconds


class PopulateDataTest(TestCaseDj):
    def setUp(self):
        self.client = APIClient()
        depth = 5
        num_users = 2
        num_folders = 9
        num_entries = 19

        tree = ""
        Category.objects.all().delete()
        Tag.objects.all().delete()
        Folder.objects.all().delete()
        Entry.objects.all().delete()
        USER.objects.exclude(is_superuser=True).delete()
        for _ in range(0, num_users):
            num_entries_user = num_entries
            num_folder_user = num_folders
            user = USER.objects.create(email=fake.email(), password="password123")

            root = Folder.objects.create(root=True, user=user, name="root")
            categories = [
                Category.objects.create(name=fake.word(), user=user)
                for _ in range(0, 3)
            ]
            tags = [
                Tag.objects.create(name=fake.word(), user=user) for _ in range(0, 5)
            ]
            tree += f"user: {user}\n"

            def gen_row_folders(
                level=depth,
                max_depth_path=True,
                parent=root,
            ):
                nonlocal num_folder_user
                if level == 0 or num_folder_user < 1:
                    return
                if max_depth_path:
                    success = False
                    while not success:
                        try:
                            max_depth_folder = Folder.objects.create(
                                user=user, parent=parent, name=fake.word()
                            )
                            success = True
                        except NameDublicateException:
                            continue
                    num_folder_user -= 1
                    gen_row_folders(
                        level=level - 1,
                        max_depth_path=True,
                        parent=max_depth_folder,
                    )

                    max_depth_folder = False
                num_folder_row = 0
                if num_folder_user > 1:
                    num_folder_row = random.randint(0, num_folder_user // 2)
                elif num_folder_user == 1:
                    num_folder_row = 1

                for _ in range(num_folder_row):
                    success = False
                    while not success:
                        try:
                            folder = Folder.objects.create(
                                user=user, parent=parent, name=fake.word()
                            )
                            success = True
                        except NameDublicateException:
                            continue
                    num_folder_user -= 1
                    gen_row_folders(
                        level=level - 1,
                        max_depth_path=False,
                        parent=folder,
                    )

            gen_row_folders()

            folders = Folder.objects.filter(user=user)

            def gen_entry(parent):

                tags_selected = random.choices(population=tags, k=2)
                success = False
                while not success:
                    try:
                        entry = Entry.objects.create(
                            user=user,
                            name=fake.word(),
                            category=random.choice(categories),
                            context_description=fake.text(max_nb_chars=256),
                            context_date=gen_random_datetime(
                                start=datetime(1900, 1, 1), end=datetime(2025, 1, 1)
                            ),
                            parent=parent,
                        )
                        success = True
                    except NameDublicateException:
                        continue
                entry.tags.set(tags_selected)

            while num_entries_user > 0:
                f = random.choice(folders)
                gen_entry(f)
                num_entries_user -= 1

            def walk_tree(dir, indent):
                nonlocal tree
                folders, entries = dir.get_children()
                contains = len(folders) + len(entries)
                tree += (
                    indent * "| " + "f: " + dir.name + f" | contains: {contains}" + "\n"
                )
                for folder in folders:
                    walk_tree(folder, indent + 1)
                for entry in entries:
                    tree += (indent + 1) * "| " + "e: " + entry.name + "\n"

            walk_tree(root, 0)

    def test_filter(self):
        users = USER.objects.all()
        user = users[1]
        tags = Tag.objects.filter(user=user)
        category_filter = Category.objects.filter(user=user).first()

        tags_filter = tags[0:2]
        print("filter by tags:", tags_filter)
        user_token = CustomJWTTest(
            content={"id": str(user.id)},
        ).get_token()
        self.client.cookies["jwt"] = user_token

        # request testing tags and tags_mode=and filter
        response_1 = self.client.get(
            path=f"http://127.0.0.1:8000/api-v1/catalog/entries/?tags={tags_filter[0].name}&tags={tags_filter[1].name}&tags_mode=and",
        )

        entries = response_1.json()
        # print("ENTRIES FINAL:", len(entries), entries)

        # asserting test
        tags, categories = [entry["tags"] for entry in response_1.json()], [
            entry["category"] for entry in response_1.json()
        ]
        # print("tags:", tags)
        # print("categories:", categories)
        tags_matching_request = True
        tags_filter_names = [t.name for t in tags_filter]
        for entry_tags in tags:
            for i, tag in enumerate(entry_tags):
                tags_matching_request = False if tag != tags_filter_names[i] else True
        if len(entries) == 0:
            tags_matching_request = True

        self.assertTrue(tags_matching_request)

        # request testing tags and tags_mode=and filter
        response_2 = self.client.get(
            path=f"http://127.0.0.1:8000/api-v1/catalog/entries/?category={category_filter}",
        )
        print("RESPONSE 2:", "filter by category:", category_filter)
        entries_2 = response_2.json()
        categories = [entry["category"] for entry in entries_2]
        print("categories:", categories)
        category_match_request = True
        for c in categories:
            if c != category_filter.name:
                category_match_request = False
        if len(entries_2) == 0:
            category_match_request = True

        self.assertTrue(category_match_request)
