from rest_framework import permissions
from django.contrib.auth import get_user_model
from rest_framework import exceptions
import os, jwt


USER_MODEL = get_user_model()


def jwt_auth(token):
    """Tries to authenticate user with id decoded from JWT token and returns the user object"""
    if not token:
        return False

    try:
        payload = jwt.decode(token, os.environ.get("JWT_SECRET"), "HS256")
    except jwt.ExpiredSignatureError:
        return False

    try:
        user = USER_MODEL.objects.get(id=payload["id"])
    except USER_MODEL.DoesNotExist:
        return False
    return user


class IsJWTAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        print("permission..")
        is_authenticated = jwt_auth(request.COOKIE.get("jwt"))
        return is_authenticated
