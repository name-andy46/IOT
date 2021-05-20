from rest_framework import serializers
from .models import *


class DeviceSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    user = serializers.CharField(required=False, allow_blank=True, max_length=100)
    name = serializers.CharField(required=False, allow_blank=True, max_length=100)
    created_at = serializers.DateTimeField()


    def create(self, validated_data):
        return Device.objects.create(**validated_data)


    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.save()

        return instance



class TemperatureSensorSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    device = serializers.CharField(required=False, allow_blank=True, max_length=100)
    temperature = serializers.DecimalField(max_digits=5, decimal_places=2)
    log_time = serializers.DateTimeField()


class PressureSensorSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    device = serializers.CharField(required=False, allow_blank=True, max_length=100)
    pressure = serializers.DecimalField(max_digits=7, decimal_places=2)
    log_time = serializers.DateTimeField()