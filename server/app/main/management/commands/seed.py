from django.core.management.base import BaseCommand
from main.models import Node, Folder, Entry, Category, Tag
from django.contrib.auth import get_user_model
import random
from faker import Faker
from datetime import datetime, timedelta
from main.exceptions import NameDublicateException
from django.db.utils import OperationalError


USER = get_user_model()
fake = Faker()


def gen_random_datetime(start: datetime, end: datetime):
    delta = end - start
    random_seconds = delta * random.random()
    return start + random_seconds


class Command(BaseCommand):
    help = "Populate the database with test data"

    def add_arguments(self, parser):
        parser.add_argument(
            "--depth",
            type=int,
            default=3,
            help="Depth of the file tree",
        )

        parser.add_argument("--users", type=int, default=2, help="Number of users")
        parser.add_argument("--folders", type=int, default=3, help="Number of folders")
        parser.add_argument("--entries", type=int, default=3, help="Number of entries")

    def handle(self, *args, **options):
        depth = options["depth"]
        num_users = options["users"]
        num_folders = options["folders"]
        num_entries = options["entries"]

        tree = ""

        Category.objects.all().delete()
        Tag.objects.all().delete()
        Folder.objects.all().delete()
        Entry.objects.all().delete()
        USER.objects.exclude(is_superuser=True).delete()

        for _ in range(0, num_users):
            num_entries_user = num_entries
            num_folder_user = num_folders
            user = USER.objects.create_user(email=fake.email(), password="password123")

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
            print(user)
        self.stdout.write(self.style.SUCCESS("✅ Database seeded with fake data"))
