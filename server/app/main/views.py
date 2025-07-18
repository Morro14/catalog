from django.shortcuts import render, get_object_or_404
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
import jwt, os


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
    # TODO: check if already logged in
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
        response.data = {"message": "User has successfully logged in."}
        return response


class PasswordChangeView(views.APIView):
    # TODO
    pass


class PasswordRecoveryView(views.APIView):
    def post(self, request):
        email = request.data["email"]
        user = User.objects.get(email=email)
        if not user:
            return Response({"message": "User with this email is not found."})

        token = CustomJWT(
            content={"email": request.data["email"]}, expires_in=600
        ).get_token()
        response = Response()
        response.set_cookie(key="token", value=token, httponly=True)
        response.data = {
            "message": "Token for password recovery email has been issued."
        }
        return response


class UserView(views.APIView):
    def get(self, request):
        token = request.COOKIES.get("jwt")

        if not token:
            raise exceptions.AuthenticationFailed("Unauthenticated!")

        try:
            payload = jwt.decode(token, os.environ.get("JWT_SECRET"), "HS256")
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Unauthenticated!")

        user = User.objects.get(id=payload["id"])
        serializer = UserSerializer(user)
        print(serializer.data)
        return Response(serializer.data)


class LogoutView(views.APIView):
    def get(self, request):
        response = Response()
        response.delete_cookie("jwt")
        response.data = {"message": "success"}
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
