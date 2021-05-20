from django.urls import path

from . import views

app_name = 'api_app'
urlpatterns = [
    path('', views.dashboard_template, name='index'),
    path('template/<str:device_id>/', views.device_template, name='device_template'),
    path('device/<str:device_id>/<str:start_range>/<str:end_range>/', views.get_logs, name='device_template'),
    path('dash_info/', views.get_devices, name='devices-list'),
    path('login/', views.login, name='login'),
    path('add/', views.add_device, name='add_device'),
    path('update/', views.update_device, name='update_device'),
    path('temperature/', views.log_temperature, name='log_temperature'),
    path('pressure/', views.log_pressure, name='log_pressure'),
]