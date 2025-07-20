from main.models import DataEntry, DataTag, DataType
from rest_framework import serializers


class DataEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = DataEntry
        fields = "__all__"


class DataTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataTag
        fields = "__all__"


class DataTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataType
        fields = "__all__"
