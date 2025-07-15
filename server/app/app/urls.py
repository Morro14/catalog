"""
URL configuration for app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from main.views import (
    DataEntryViewSet,
    DataTagViewSet,
    DataTypeViewSet,
    test_oauth_view,
)
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r"data-entries", DataEntryViewSet, basename="data-entry")
router.register(r"data-types", DataTypeViewSet, basename="data-type")
router.register(r"data-tags", DataTagViewSet, basename="data-tag")


urlpatterns = [
    path("admin/", admin.site.urls),
    path("test/", test_oauth_view),
    path("api-v1/", include(router.urls)),
    path("auth/", include("main.urls")),
]
