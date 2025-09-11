from django.urls import path


from main.views import (
    TagViewSet,
    TypeViewSet,
    TreeView,
    GoogleDriveFiles,
    EntryView,
    EntryListView,
)
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r"data-types", TypeViewSet, basename="type")
router.register(r"data-tags", TagViewSet, basename="tag")

urlpatterns = [
    path("tree", TreeView.as_view()),
    path("google/get-files", GoogleDriveFiles.as_view()),
    path("entry/<int:pk>", EntryView.as_view()),
    path("entries/", EntryListView.as_view()),
]
