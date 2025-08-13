from rest_framework.response import Response
from rest_framework import views, exceptions
from .models import User
from .serializers import UserSerializer

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


class ProfileView(views.APIView):
    def get(self, request):
        token = request.COOKIES.get("jwt")
        if not token:
            raise exceptions.AuthenticationFailed("Unauthorized!")
        try:
            payload = jwt.decode(token, os.environ.get("JWT_SECRET"), "HS256")
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Unauthenticated!")
        user = User.objects.get(id=payload["id"])
        response = Response({"email": user["email"]})
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
    def get(self):
        response = Response()
        response.delete_cookie("jwt")
        response.data = {"message": "success"}
        return response
