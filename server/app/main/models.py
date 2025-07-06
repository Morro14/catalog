from datetime import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager, Group


# Create your models here.
class DataEntry(models.Model):
    """Model representing data entry of any type"""

    def __str__(self) -> str:
        return f"{self.type} {self.pk}"

    title = models.CharField(max_length=64, default="")
    type = models.ForeignKey(to="DataType", on_delete=models.CASCADE)
    tags = models.ManyToManyField(to="DataTag")
    context_date = models.DateField(blank=True)
    context_description = models.TextField(max_length=512, default="")
    create_time = models.DateTimeField()
    file_realid = models.CharField(max_length=64, default="")
    thumbnail = models.CharField(default=None, null=True, max_length=64)

    class Meta:
        verbose_name = "Data"
        verbose_name_plural = "Data"

    def save(self):

        self.create_time = datetime.now()
        super().save()


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
    parents = models.ForeignKey(
        to="Node", related_name="parent_node",
        related_query_name="parent_nodes",
        on_delete=models.CASCADE
    )


class DataNode(Node):
    data_entry = models.OneToOneField(to=DataEntry, on_delete=models.CASCADE)


class FolderNode(Node):
    # dev: blank and default are for testing
    name = models.CharField(max_length=32)
    children = models.ManyToManyField(
        to="Node", related_name="children_node",
        related_query_name="children_nodes"
    )


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
