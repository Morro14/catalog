from django.test import TestCase as TestCaseDj
from .models import Node, Folder, Entry, Type, Tag
from django.contrib.auth import get_user_model


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
