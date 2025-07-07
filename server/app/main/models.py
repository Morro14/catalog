from main.exceptions import RootNodeException
from datetime import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager, Group


class DataType(models.Model):
    def __str__(self) -> str:
        return self.name

    name = models.CharField(unique=True, max_length=255)

    class Meta:
        verbose_name = "Data type"
        verbose_name_plural = "Data types"


class DataTag(models.Model):
    def __str__(self) -> str:
        return self.name

    name = models.CharField(unique=True, max_length=255)

    class Meta:
        verbose_name = "tag"
        verbose_name_plural = "tags"


class MyUser(AbstractUser):
    pass


# class FileTree(models.Model):
#     def __str__(self):
#         return self.default_tree

#     tree = models.JSONField(default=dict(root=''))

#     def add_node(node):
#         pass


class Node(models.Model):
    def __str__(self):
        if self.node_type == 'folder':
            return self.folder.name
        elif self.node_type == 'data_entry':
            return self.data_entry.title

    root = models.BooleanField(default=False)
    node_type = models.CharField(
        choices={'folder': 'Folder', 'data_entry': 'Data'})

    parent = models.ForeignKey(
        to="Node", related_name="child_nodes",
        on_delete=models.CASCADE,
        default=None,
        null=True
    )

    def get_siblings(self):
        if not self.root:
            siblings = self.parent.child_nodes.exclude(pk=self.pk)
            return siblings
        else:
            raise RootNodeException


class Folder(Node):
    def __str__(self):
        return self.name

    name = models.CharField(max_length=32)

    def get_children(self):
        children = Node.objects.filter(parent__pk=self.pk)
        return children

    def save(self, *args, **kwargs):
        self.node_type = 'folder'
        super(Folder, self).save(*args, **kwargs)


class DataEntry(Node):
    """Model representing data entry of any type"""

    def __str__(self) -> str:
        return f"{self.data_type} {self.pk}"

    title = models.CharField(max_length=64, default="")
    data_type = models.ForeignKey(to="DataType", on_delete=models.CASCADE)
    tags = models.ManyToManyField(to="DataTag")
    context_date = models.DateField(blank=True, null=True)
    context_description = models.TextField(max_length=512, default="")
    create_time = models.DateTimeField(auto_created=True, auto_now=True)
    file_realid = models.CharField(max_length=64, default="")
    thumbnail = models.CharField(default=None, null=True, max_length=64)

    node = models.OneToOneField(to='Node', parent_link=True,
                                on_delete=models.CASCADE,
                                related_name='data_entry',
                                related_query_name='data_entries')

    def save(self, *args, **kwargs):
        self.node_type = 'data_entry'
        super(DataEntry, self).save(*args, **kwargs)

    class Meta:
        verbose_name = "Data"
        verbose_name_plural = "Data"


class CustomUserManager(UserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        if email:
            email = self.normalize_email(email)
        user = self.model(username=username, **extra_fields)
        user.password = password
        user.save()
        user_group = Group.objects.get_or_create(name="user_group")
        user.groups.add(user_group)
        return user
