from django.test import TestCase as TestCaseDj
from .models import Node, Folder, Entry, Type, Tag
from django.contrib.auth import get_user_model
from exceptions import NameDublicateException


USER = get_user_model()


class TreeTest(TestCaseDj):
    def setUp(self):
        root = Folder.objects.create(root=True, name="root")
        folder_1 = Folder.objects.create(name="Folder 1", parent=root)
        type_1 = Type.objects.create(name="Type 1")
        Entry.objects.create(title="Entry 1", parent=root, data_type=type_1)
        Entry.objects.create(title="Entry 2", parent=folder_1, data_type=type_1)

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
        type_1 = Type.objects.create(name="Type 1")
        Entry.objects.create(name="Entry 1", parent=root, data_type=type_1, user=user)
        Entry.objects.create(
            name="Entry 2", parent=folder_1, data_type=type_1, user=user
        )

    def test_unique_name(self):
        user = USER.objects.get(email="test@email.com")
        root = Folder.objects.filter(root=True).first()
        entry = Entry.objects.get(name="Entry 1")
        # folder1 = Folder.objects.get(name="Folder 1")
        type_1 = Type.objects.get(name="Type 1")
        Entry.objects.create(name="Entry 2", parent=root, data_type=type_1, user=user)


import random
from faker import Faker
from datetime import datetime, timedelta
import requests

fake = Faker()


def gen_random_datetime(start: datetime, end: datetime):
    delta = end - start
    random_seconds = delta * random.random()
    return start + random_seconds


class PopulateDataTest(TestCaseDj):
    def test_populate(self):
        depth = 5
        num_users = 2
        num_folders = 90
        num_entries = 90

        tree = ""
        Type.objects.all().delete()
        Tag.objects.all().delete()
        Folder.objects.all().delete()
        Entry.objects.all().delete()
        USER.objects.exclude(is_superuser=True).delete()
        for _ in range(0, num_users):
            num_entries_user = num_entries
            num_folder_user = num_folders
            user = USER.objects.create(email=fake.email(), password="password123")
            root = Folder.objects.create(root=True, user=user, name="root")
            types = [
                Type.objects.create(name=fake.word(), user=user) for _ in range(0, 3)
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
                # print("folders left:", num_folder_user)
                # print("total folders: ", total_folders)
                if level == 0 or num_folder_user < 1:
                    return
                if max_depth_path:
                    max_depth_folder = Folder.objects.create(
                        user=user, parent=parent, name=fake.word()
                    )
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
                    folder = Folder.objects.create(
                        user=user, parent=parent, name=fake.word()
                    )
                    num_folder_user -= 1
                    gen_row_folders(
                        level=level - 1,
                        max_depth_path=False,
                        parent=folder,
                    )

            gen_row_folders()

            folders = Folder.objects.filter(user=user)
            print("folders:", len(folders), folders)

            def gen_entry(parent):

                tags_selected = random.choices(population=tags, k=random.randrange(2))

                entry = Entry.objects.create(
                    user=user,
                    name=fake.word(),
                    data_type=random.choice(types),
                    context_description=fake.text(max_nb_chars=256),
                    context_date=gen_random_datetime(
                        start=datetime(1900, 1, 1), end=datetime(2025, 1, 1)
                    ),
                    parent=parent,
                )
                entry.tags.set(tags_selected)

            while num_entries_user > 0:
                f = random.choice(folders)
                gen_entry(f)
                num_entries_user -= 1

            # log tree
            entries_ = Entry.objects.filter(user=user)
            print("entries:", len(entries_), entries_)

            # print("tree before walking", tree)
            def walk_tree(dir, indent):
                nonlocal tree
                # print("dir:", dir.name)

                folders, entries = dir.get_children()
                # print(folders, entries)
                contains = len(folders) + len(entries)
                # print(contains)
                tree += (
                    indent * "| " + "f: " + dir.name + f" | contains: {contains}" + "\n"
                )
                for folder in folders:
                    walk_tree(folder, indent + 1)
                for entry in entries:
                    tree += (indent + 1) * "| " + "e: " + entry.name + "\n"

            walk_tree(root, 0)
        print(tree)


class EntryTest(TestCaseDj):
    def test_create_entry(self):
        user = USER.objects.create(email=fake.email(), password="eifj2938rW")
        root = Folder.objects.create(root=True, name=fake.word(), user=user)
        tags = [Tag.objects.create(name=fake.word(), user=user) for _ in range(3)]
        types = [Type.objects.create(name=fake.word(), user=user) for _ in range(2)]
        entry = Entry.objects.create(user=user, data_type=types[0], parent=root)
        entry.tags.set(tags)
        print("entry tags:", entry.tags.all())
