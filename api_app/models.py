from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


# Create your models here.

class User(AbstractUser):
    
    def __str__(self):
        return self.username



class Device(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class TemperatureSensor(models.Model):
    device = models.ForeignKey(Device, on_delete=models.SET_NULL, null=True)
    temperature = models.DecimalField(max_digits=5, decimal_places=2)
    log_time = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'{self.device} - {self.temperature}'



class PressureSensor(models.Model):
    device = models.ForeignKey(Device, on_delete=models.SET_NULL, null=True)
    pressure = models.DecimalField(max_digits=7, decimal_places=2)
    log_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.device} - {self.pressure}'

