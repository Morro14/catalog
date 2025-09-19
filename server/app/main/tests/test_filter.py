from django.test import TestCase as TestCaseDj
from rest_framework.test import APIClient, APITestCase
from ..models import Node, Folder, Entry, Category, Tag
from django.contrib.auth import get_user_model
from django.core.management import call_command
from auth_app.utils.jwt_ import CustomJWTTest


USER = get_user_model()


class TreeTest(APITestCase):
    def setUp(self):
        DEPTH = 3
        FOLDERS = 9
        ENTRIES = 15
        USERS = 2

        call_command("seed", users=USERS, entries=ENTRIES, folders=FOLDERS, depth=DEPTH)

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

        # request testing category filter
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
