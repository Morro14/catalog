from django.test import TestCase
from main.models import Node, Folder, DataEntry, DataTag, DataType


class NodeTest(TestCase):
    def setUp(self):
        DataType.objects.create(name='doc')
        DataTag.objects.create(name='family')

    def test_folder_methods(self):
        folder_root = Folder.objects.create(name='Folder 1', root=True)
        folder_1 = Folder.objects.create(
            name='Folder 1', parent=folder_root)
        folder_2 = Folder.objects.create(
            name='Folder 2', parent=folder_root)
        data_1 = DataEntry.objects.create(
            title='Data 1',
            file_realid='Some ID',
            thumbnail='Some thumbnail',
            data_type=DataType.objects.get(name='doc'),
            parent=folder_root
        )
        data_1.tags.set(DataTag.objects.filter(name='family'))

        # print(folder_1.parent)
        children = folder_root.get_children()
        print('Children:', children)
        siblings = folder_1.get_siblings()
        print('Siblings folder 1:', siblings)
        # self.assertEqual(child_node.type, 'folder', 'Node type check')
        # print(hasattr(child_node, 'folder_node'))


# class DataEntryTest(TestCase):
#     def setUp(self):
#         DataType.objects.create(name='doc')
#         DataTag.objects.create(name='family')

#     def test_DataEntry(self):
#         data_1 = DataEntry.objects.create(
#             title='Data 1',
#             file_realid='Some ID',
#             thumbnail='Some thumbnail',
#             data_type=DataType.objects.get(name='doc')
#         )
#         data_1.tags.set(DataTag.objects.filter(name='family'))
#         print(data_1)
