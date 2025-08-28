from django.urls import path


from main.views import EntryViewSet, TagViewSet, TypeViewSet, TreeView, GoogleDriveFiles
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r"data-entries", EntryViewSet, basename="entry")
router.register(r"data-types", TypeViewSet, basename="type")
router.register(r"data-tags", TagViewSet, basename="tag")

urlpatterns = [
    path("tree", TreeView.as_view()),
    path("google/get-files", GoogleDriveFiles.as_view()),
]
