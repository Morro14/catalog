from django.contrib import admin
from .forms import FolderForm, EntryForm
from main.models import Entry, Tag, Type, Folder


# Register your models here.


class EntryAdmin(admin.ModelAdmin):
    form = EntryForm


class TypeAdmin(admin.ModelAdmin):
    pass


class TagAdmin(admin.ModelAdmin):
    pass


class FolderAdmin(admin.ModelAdmin):
    form = FolderForm


admin.site.register(Entry, EntryAdmin)
admin.site.register(Type, TypeAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Folder, FolderAdmin)
