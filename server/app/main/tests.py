from django.test import TestCase as TestCaseDj
from rest_framework.test import APIClient, APITestCase
from .models import Node, Folder, Entry, Category, Tag
from django.contrib.auth import get_user_model
from .exceptions import NameDublicateException
from auth_app.utils.jwt_ import CustomJWTTest
import json
from django.db.models import Q, Count


USER = get_user_model()


class TreeTest(APITestCase):
    def setUp(self):
        root = Folder.objects.create(root=True, name="root")
        folder_1 = Folder.objects.create(name="Folder 1", parent=root)
        category = Category.objects.create(name="Category 1")
        Entry.objects.create(title="Entry 1", parent=root, category=category)
        Entry.objects.create(title="Entry 2", parent=folder_1, category=category)

    def test_gen_tree(self):
        tree = {"root": []}
        root = Folder.objects.filter(root=True).first()

        def get_row(parent):
            children_obj = parent.folder.get_children()
            children_data = []
            for c_ in children_obj:
                if c_.node_type == "folder":
                    c = c_.folder
                    children_data.append(
                        {"pk": c.pk, "type": "folder", "name": c.name, "children": []}
                    )
                if c_.node_type == "entry":
                    c = c_.entry
                    children_data.append({"pk": c.pk, "type": "entry", "name": c.title})

            for c in children_data:
                if c["type"] == "folder":
                    folder_obj = Folder.objects.get(pk=c["pk"])

                    parent_ = folder_obj
                    c["children"] = get_row(parent_)
            return children_data

        tree["root"] = get_row(root)
        print(tree)


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


import random
from faker import Faker
from datetime import datetime, timedelta
import requests
import os

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

        tags_filter = tags[0:2]
        print("filter by tags:", tags_filter)
        user_token = CustomJWTTest(
            content={"id": str(user.id)},
        ).get_token()
        # print("token", user_token)
        self.client.cookies["jwt"] = user_token
        response_1 = self.client.get(
            path=f"http://127.0.0.1:8000/api-v1/catalog/entries/?tags={tags_filter[0].name}&tags={tags_filter[1].name}&tags_mode=and",
        )
        # response_2 = self.client.get(
        #     path=f"http://127.0.0.1:8000/api-v1/catalog/entries/?tags={tags_filter[0].name}",
        # )
        entries = response_1.json()
        print("ENTRIES FINAL:", len(entries), entries)
        tags, categories = [entry["tags"] for entry in response_1.json()], [
            entry["category"] for entry in response_1.json()
        ]
        tags_matching_request = True
        tags_filter_names = [t.name for t in tags_filter]
        for entry_tags in tags:
            for i, tag in enumerate(entry_tags):
                tags_matching_request = False if tag != tags_filter_names[i] else True
        if len(entries) == 0:
            tags_matching_request = True
        print("tags:", tags)
        # print("categories:", categories)
        self.assertTrue(tags_matching_request)

    def test_query_filter(self):
        users = USER.objects.all()
        user = users[1]
        tags = Tag.objects.filter(user=user)

        tags_filter = tags[:2]
        tags_ids = tags_filter.values("id")
        # print("filter by tags:", tags_filter)

        entries_f = (
            Entry.objects.filter(user=user)
            # .prefetch_related("tags")
            .annotate(
                num_matching_tags=Count("tags", filter=Q(tags__id__in=tags_ids))
            ).filter(num_matching_tags=len(tags_ids))
        )

        print("entries filtered:", entries_f)
        for entry in entries_f:
            print(Tag.objects.filter(entry__pk=entry.pk))


class EntryTest(TestCaseDj):
    def test_create_entry(self):
        user = USER.objects.create(email=fake.email(), password="eifj2938rW")
        root = Folder.objects.create(root=True, name=fake.word(), user=user)
        tags = [Tag.objects.create(name=fake.word(), user=user) for _ in range(3)]
        categories = [
            Category.objects.create(name=fake.word(), user=user) for _ in range(2)
        ]
        entry = Entry.objects.create(user=user, category=categories[0], parent=root)
        entry.tags.set(tags)
        print("entry tags:", entry.tags.all())


# class EntryFilterTest(TestCaseDj):
#     def test_filter(self):
#         user = USER.objects.create(email="test@email.com", password="password123")
