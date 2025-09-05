from main.exceptions import RootNodeException, NameDublicateException
from django.db import models
from django.contrib.auth import get_user_model


USER = get_user_model()


class Type(models.Model):
    def __str__(self) -> str:
        return self.name

    name = models.CharField(unique=True, max_length=255)
    user = models.ForeignKey(to=USER, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "data type"
        verbose_name_plural = "data types"


class Tag(models.Model):
    def __str__(self) -> str:
        return self.name

    name = models.CharField(unique=True, max_length=255)
    user = models.ForeignKey(to=USER, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "tag"
        verbose_name_plural = "tags"


class Node(models.Model):
    def __str__(self):
        if self.node_type == "folder":
            return "folder" + self.folder.name
        elif self.node_type == "entry":
            return "entry" + self.entry.name

    root = models.BooleanField(default=False)
    node_type = models.CharField(choices={"folder": "Folder", "entry": "Entry"})
    user = models.ForeignKey(to=USER, on_delete=models.CASCADE)

    parent = models.ForeignKey(
        to="Folder",
        related_name="child_nodes",
        on_delete=models.CASCADE,
        blank=True,
        default=None,
        null=True,
    )

    def get_name(self):
        node = self
        if self.node_type == "folder":
            return node.folder.name
        return node.entry.name

    def get_siblings(self):
        if self.root:
            raise RootNodeException()

        siblings = self.parent.child_nodes.exclude(pk=self.pk)
        return siblings


class Folder(Node):
    def __str__(self):
        return self.name

    name = models.CharField(max_length=32)
    node = models.OneToOneField(
        to="Node",
        parent_link=True,
        on_delete=models.CASCADE,
        related_name="folder",
        related_query_name="folders",
    )

    def get_children(self):
        children_folders = Folder.objects.filter(parent__pk=self.pk).order_by("name")
        children_entries = Entry.objects.filter(parent__pk=self.pk).order_by("name")
        return children_folders, children_entries

    def save(self, *args, **kwargs):
        self.node_type = "folder"
        if not self.root:
            siblings = self.get_siblings()
            for s in siblings:
                if s.get_name() == self.name:
                    raise NameDublicateException
        super(Folder, self).save(*args, **kwargs)


class Entry(Node):
    """Model representing data entry of any type"""

    def __str__(self) -> str:
        return f"{self.data_type} {self.pk}"

    name = models.CharField(max_length=64, default="")
    data_type = models.ForeignKey(to="Type", on_delete=models.CASCADE, blank=True)
    tags = models.ManyToManyField(to="Tag", blank=True)
    context_date = models.DateField(blank=True, null=True)
    context_description = models.TextField(max_length=512, default="")
    create_time = models.DateTimeField(auto_created=True, auto_now=True)
    file_realid = models.CharField(max_length=64, default="")
    thumbnail = models.CharField(default=None, null=True, max_length=64)

    node = models.OneToOneField(
        to="Node",
        parent_link=True,
        on_delete=models.CASCADE,
        related_name="entry",
        related_query_name="entries",
    )

    def save(self, *args, **kwargs):
        self.node_type = "entry"

        siblings = self.get_siblings()
        for s in siblings:
            if s.get_name() == self.name:
                raise NameDublicateException

        super(Entry, self).save(*args, **kwargs)

    class Meta:
        verbose_name = "Entry"
        verbose_name_plural = "Entries"
