from main.models import Entry, Tag, Type
from rest_framework import serializers


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = "__all__"


class EntrySerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(slug_field="name", many=True, read_only=True)
    data_type = serializers.SlugRelatedField(slug_field="name", read_only=True)

    class Meta:
        model = Entry
        fields = "__all__"
