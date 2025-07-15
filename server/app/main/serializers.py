from main.models import DataEntry, DataTag, DataType, User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "password"]

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


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
