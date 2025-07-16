from django.shortcuts import render
from django.http.response import HttpResponse
from rest_framework.response import Response
from main.services.google_drive_test import main as get_drive_info
from rest_framework.viewsets import ModelViewSet
from rest_framework import views, exceptions
from main.models import DataEntry, DataType, DataTag, User
from main.serializers import (
    DataEntrySerializer,
    DataTagSerializer,
    DataTypeSerializer,
    UserSerializer,
)
from main.utils.jwt_ import CustomJWT
from dotenv import load_dotenv

load_dotenv()


# test view for Google Drive
def test_oauth_view(request):
    get_drive_info()
    return HttpResponse()


class RegisterView(views.APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class LoginView(views.APIView):
    def post(self, request):
        email = request.data["email"]
        password = request.data["password"]

        user = User.objects.filter(email=email).first()
        if not User:
            raise exceptions.AuthenticationFailed("User not found.")
        if not user.check_password(password):
            raise exceptions.AuthenticationFailed("Incorrect password.")

        token = CustomJWT(content={"id": str(user.id)}).get_token()
        response = Response()
        response.set_cookie(key="jwt", value=token, httponly=True)
        response.data = {"jwt": token}
        return response


class DataEntryViewSet(ModelViewSet):
    queryset = DataEntry.objects.all()
    serializer_class = DataEntrySerializer


class DataTypeViewSet(ModelViewSet):
    queryset = DataType.objects.all()
    serializer_class = DataType


class DataTagViewSet(ModelViewSet):
    queryset = DataTag.objects.all()
    serializer_class = DataTagSerializer
