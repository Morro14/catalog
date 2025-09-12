from django.contrib import admin
from .forms import FolderForm, EntryForm
from main.models import Entry, Tag, Category, Folder


# Register your models here.


class EntryAdmin(admin.ModelAdmin):
    form = EntryForm


class CategoryAdmin(admin.ModelAdmin):
    pass


class TagAdmin(admin.ModelAdmin):
    pass


class FolderAdmin(admin.ModelAdmin):
    form = FolderForm


admin.site.register(Entry, EntryAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Folder, FolderAdmin)
