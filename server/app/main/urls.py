from django.urls import path


from main.views import (
    TreeView,
    GoogleDriveFiles,
    EntryView,
    EntryListView,
)

urlpatterns = [
    path("tree", TreeView.as_view()),
    path("google/get-files", GoogleDriveFiles.as_view()),
    path("entry/<int:pk>", EntryView.as_view()),
    path("entries/", EntryListView.as_view()),
]
