from django.shortcuts import render
from django.http.response import HttpResponse
from main.services.google_drive_test import main as get_drive_info
from rest_framework.viewsets import ModelViewSet
from main.models import DataEntry, DataType, DataTag
from main.serializers import DataEntrySerializer, DataTagSerializer, DataTypeSerializer


# Create your views here.
def test_oauth_view(request):
    get_drive_info()
    return HttpResponse()


class DataEntryViewSet(ModelViewSet):
    queryset = DataEntry.objects.all()
    serializer_class = DataEntrySerializer


class DataTypeViewSet(ModelViewSet):
    queryset = DataType.objects.all()
    serializer_class = DataType


class DataTagViewSet(ModelViewSet):
    queryset = DataTag.objects.all()
    serializer_class = DataTagSerializer
