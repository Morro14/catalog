from rest_framework.response import Response
from main.services.google_drive_test import main as get_drive_info
from rest_framework.viewsets import ModelViewSet
from rest_framework import views, exceptions
from main.models import DataEntry, DataType, DataTag
from main.serializers import (
    DataEntrySerializer,
    DataTagSerializer,
    DataTypeSerializer,
)
from auth_app.serializers import UserSerializer
from dotenv import load_dotenv
import jwt, os
from django.contrib.auth import get_user_model


load_dotenv()

USER_MODEL = get_user_model()


# test view for Google Drive
# def test_oauth_view(request):
#     get_drive_info()
#     return HttpResponse()


class UserView(views.APIView):
    def get(self, request):
        token = request.COOKIES.get("jwt")

        if not token:
            raise exceptions.AuthenticationFailed("Unauthenticated!")

        try:
            payload = jwt.decode(token, os.environ.get("JWT_SECRET"), "HS256")
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Unauthenticated!")

        user = USER_MODEL.objects.get(id=payload["id"])
        serializer = UserSerializer(user)
        print(serializer.data)
        return Response(serializer.data)


class DataEntryViewSet(ModelViewSet):
    queryset = DataEntry.objects.all()
    serializer_class = DataEntrySerializer


class DataTypeViewSet(ModelViewSet):
    queryset = DataType.objects.all()
    serializer_class = DataType


class DataTagViewSet(ModelViewSet):
    queryset = DataTag.objects.all()
    serializer_class = DataTagSerializer
