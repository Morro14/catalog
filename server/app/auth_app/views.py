from rest_framework.response import Response
from rest_framework import views, exceptions
from rest_framework.permissions import AllowAny
from .models import User
from .serializers import UserSerializer
from django.conf import settings
import requests
from django.shortcuts import redirect, get_object_or_404
from django.http import HttpResponseRedirect

from .utils.jwt_ import CustomJWT
from dotenv import load_dotenv
import jwt, os

load_dotenv()


class RegisterView(views.APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except exceptions.ValidationError as e:
            print(e)
            return Response(data={"message": "User already exists."})
        serializer.save()
        return Response(serializer.data)


class LoginView(views.APIView):
    # TODO: check if already logged in and multiple devices login
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data["email"]
        password = request.data["password"]
        user = get_object_or_404(klass=User, email=email)
        if not User:
            print("user not found")
            raise exceptions.AuthenticationFailed("User not found.")
        if not user.check_password(password):
            print("incorrect password")
            raise exceptions.AuthenticationFailed("Incorrect password.")
        token = CustomJWT(content={"id": str(user.id)}).get_token()
        response = Response()
        response.set_cookie(
            key="jwt",
            value=token,
            httponly=True,
            samesite="None",
            secure=True,
        )
        print(response.cookies)
        response.data = {"message": "User has successfully logged in."}
        return response


class GoogleLoginView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        code = request.GET.get("code")
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": "http://127.0.0.1:8000/auth/google/callback",
            "grant_type": "authorization_code",
        }
        r = requests.post(token_url, data=data)
        token_data = r.json()
        print("token_data", token_data)
        access_token = token_data["access_token"]
        refresh_token = token_data["refresh_token"]

        user_info = requests.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        ).json()
        email = user_info["email"]
        user, created = User.objects.get_or_create(email=email)
        user.google_access_token = access_token
        user.google_refresh_token = refresh_token
        user.save()
        temp_token = CustomJWT(content={"id": str(user.id)}, expires_in=60).get_token()
        response = HttpResponseRedirect(
            f"http://localhost:5173/oauth-success?token={temp_token}",
        )
        return response


class TempTokenConvert(views.APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        temp_token = request.data["token"]
        user = jwt_get_user(temp_token)
        token = CustomJWT(content={"id": str(user.id)}).get_token()
        response = Response()
        response.set_cookie(
            key="jwt",
            value=token,
            httponly=True,
            samesite="None",
            secure=True,
        )
        response.data = {
            "message": "User has successfully logged in.",
            "email": user.email,
        }
        return response


def jwt_get_user(token):
    if not token:
        raise exceptions.AuthenticationFailed("Unauthorized!")
    try:
        payload = jwt.decode(token, os.environ.get("JWT_SECRET"), "HS256")
    except jwt.ExpiredSignatureError:
        raise exceptions.AuthenticationFailed("Unauthorized!")
    user = User.objects.get(id=payload["id"])
    return user


class ProfileView(views.APIView):
    def get(self, request):
        token = request.COOKIES.get("jwt")
        if not token:
            raise exceptions.AuthenticationFailed("Unauthorized!")
        try:
            payload = jwt.decode(token, os.environ.get("JWT_SECRET"), "HS256")
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Unauthorized!")
        user = User.objects.get(id=payload["id"])
        print(user)
        response = Response({"email": user.email})
        return response


class PasswordChangeView(views.APIView):
    # TODO
    pass


class PasswordRecoveryRequestView(views.APIView):
    def post(self, request):
        email = request.data["email"]
        user = User.objects.get(email=email)
        if not user:
            return Response({"message": "User with this email is not found."})

        token = CustomJWT(
            content={"email": request.data["email"]}, expires_in=600
        ).get_token()
        # TODO send email


class PasswordRecoveryConfirmView(views.APIView):
    def post(self, request):
        token = request.COOKIES.get("token")
        if not token:
            raise exceptions.bad_request()
        try:
            payload = jwt.decode(token, os.environ.get("JWT_SECRET"), "HS256")
        except jwt.exceptions.ExpiredSignatureError:
            raise exceptions.bad_request("Password recovery token has expired")
        user = User.objects.get(email=payload["email"])
        if not user:
            raise exceptions.bad_request()
        response = Response()
        response.set_cookie(key="token", value=token)

        return response


class PasswordRecoverySetPassView(views.APIView):
    def post(self, request):
        password = request.data["password"]


class UserView(views.APIView):
    def get(self, request):
        token = request.COOKIES.get("jwt")

        if not token:
            raise exceptions.AuthenticationFailed("Unauthenticated!")

        try:
            payload = jwt.decode(token, os.environ.get("JWT_SECRET"), "HS256")
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Unauthenticated!")
        # TODO exception user not found
        user = User.objects.get(id=payload["id"])
        serializer = UserSerializer(user)
        print(serializer.data)
        return Response(serializer.data)


class LogoutView(views.APIView):
    def get(self, response):
        response = Response()
        response.delete_cookie("jwt")
        response.data = {"message": "User has successfuly logged out."}
        return response
