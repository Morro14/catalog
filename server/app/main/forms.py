from .models import Folder, Entry
from django import forms


class FolderForm(forms.ModelForm):
    class Meta:
        model = Folder
        fields = ["name", "user", "root", "parent"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.root:
            self.fields["node_type"].choices = [("folder", "Folder")]


class EntryForm(forms.ModelForm):
    class Meta:
        model = Entry
        exclude = ["root", "node_type"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.root:
            self.fields["node_type"].choices = [("entry", "Entry")]
