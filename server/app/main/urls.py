from django.urls import path

from .views import UserView
from main.views import EntryViewSet, TagViewSet, TypeViewSet, TreeView
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r"data-entries", EntryViewSet, basename="entry")
router.register(r"data-types", TypeViewSet, basename="type")
router.register(r"data-tags", TagViewSet, basename="tag")

urlpatterns = [
    path("", UserView.as_view()),
    path("tree", TreeView.as_view()),
]
