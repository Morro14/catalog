from rest_framework.response import Response
from main.services.google_drive_test import main as get_drive_info
from rest_framework.viewsets import ModelViewSet
from rest_framework import views, exceptions
from main.models import Entry, Type, Tag, Folder
from main.serializers import (
    EntrySerializer,
    TagSerializer,
    TypeSerializer,
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


class EntryViewSet(ModelViewSet):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer


class TypeViewSet(ModelViewSet):
    queryset = Type.objects.all()
    serializer_class = Type


class TagViewSet(ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class TreeView(views.APIView):
    def get(self, request):
        tree = {"root": []}
        root = Folder.objects.filter(root=True).first()
        print(root)
        if not root:
            return Response(
                data={"message": "File tree has not been found"}, status=404
            )

        def get_row(parent):
            children_folders, children_entries = parent.get_children()
            children_data = []
            if len(children_folders) == 0 and len(children_entries) == 0:
                return children_data
            for c in children_folders:
                c = c.folder
                children_data.append(
                    {"pk": c.pk, "type": "folder", "name": c.name, "children": []},
                )

            for c in children_entries:
                c = c.entry
                children_data.append({"pk": c.pk, "type": "entry", "name": c.name})

            for c in children_data:
                if c["type"] == "folder":
                    folder_obj = Folder.objects.get(pk=c["pk"])
                    parent_ = folder_obj
                    c["children"] = get_row(parent_)
            return children_data

        tree["root"] = get_row(root)
        response = Response(data={"tree": tree})
        return response
