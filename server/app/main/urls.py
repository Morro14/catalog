from django.urls import path

from .views import UserView
from main.views import (
    DataEntryViewSet,
    DataTagViewSet,
    DataTypeViewSet,
)
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r"main/data-entries", DataEntryViewSet, basename="data-entry")
router.register(r"main/data-types", DataTypeViewSet, basename="data-type")
router.register(r"main/data-tags", DataTagViewSet, basename="data-tag")

urlpatterns = [
    path("main", UserView.as_view()),
]
