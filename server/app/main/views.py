from rest_framework.response import Response
from rest_framework import views, exceptions, generics, filters
from main.models import Entry, Category, Tag, Folder
from main.serializers import (
    EntrySerializer,
    TagSerializer,
    CategorySerializer,
)
from dotenv import load_dotenv
from django.contrib.auth import get_user_model
from .services.google.credentials import get_driver_service
from .services.google.build_tree import build_tree_v2, get_files
from django.shortcuts import get_object_or_404, get_list_or_404
from django_filters.rest_framework import DjangoFilterBackend
from .filters import EntryFilter
from auth_app.serializers import UserSerializer

load_dotenv()

USER_MODEL = get_user_model()


class GoogleDriveFiles(views.APIView):
    def get(self, request):
        print("google files view")
        user = self.request.user
        access_token = user.google_access_token
        if not access_token:
            return exceptions.AuthenticationFailed(detail="No Google account linked")

        service = get_driver_service(user)
        root = service.files().get(fileId="root").execute()
        files = get_files(service)
        tree = build_tree_v2(files=files, parent_id=root["id"])
        return Response({"files": tree})
        # except Exception as e:
        #     print("exception:", e)
        #     raise exceptions.NotFound("Failed to load data from Google Drive.", 404)


class EntryView(views.APIView):
    def get(self, request, pk):
        print("entry view")
        user = self.request.user
        entry = get_object_or_404(klass=Entry, pk=pk, user=user)
        if not entry:
            raise exceptions.NotFound("Entry has not been found")
        serializer = EntrySerializer(entry)
        return Response(serializer.data)


class EntryListView(generics.ListAPIView):
    serializer_class = EntrySerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = EntryFilter
    ordering_fields = ["created_at", "name"]

    def get_queryset(self):
        print("get queryset", self.request.user)
        queryset = (
            Entry.objects.filter(user=self.request.user)
            .select_related("category")
            .prefetch_related("tags")
            .distinct()
        )
        return queryset


class TreeView(views.APIView):
    def get(self, request):
        user = self.request.user
        tree = {"root": []}
        root = Folder.objects.filter(root=True, user=user).first()
        if not root:
            Folder.objects.create(root=True, name=f"root_{user.id}", user=user)
            return Response(data={"tree": tree})

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
    
class UserServiceInfoView(views.APIView):
    def get(self, request):
        user = self.request.user
        serializer = UserSerializer(user)
        # print('serializer data',serializer.data)
        response = Response(data=serializer.data['services'])
        return response
