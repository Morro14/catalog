import jwt, os
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


User = get_user_model()


class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get("jwt")
        if not token:
            return None

        try:
            payload = jwt.decode(token, os.environ.get("JWT_SECRET"), "HS256")
            # print("payload", payload)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated!")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")

        try:
            # print("payload id", payload["id"])
            # print(User.objects.all())
            user = User.objects.get(id=payload["id"])
            # print("user", user)
        except User.DoesNotExist:
            # print("User not found")
            raise AuthenticationFailed("Unauthenticated!")

        return (user, None)
