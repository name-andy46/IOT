from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
# from django.contrib.auth.decorators import login_required
# from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from rest_framework.response import Response
from .models import *
from .serializers import *
import random
import datetime


# Create your views here.
def dashboard_template(request):
    device_page = reverse('api_app:device_template', args=['device_id'])
    return render(request, 'api_app/dashboard.html', {'device_page': device_page})


def login(request):
    return render(request, 'api_app/login.html')


def device_template(request, device_id):
    return render(request, 'api_app/device.html', {'device_id': device_id})



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_devices(request):

    try:
        user = request.user
        devices = Device.objects.filter(user=user)
        serializer = DeviceSerializer(devices, many=True)
        context = {'device_list': serializer.data, 'name': str(request.user.username)}
        
        return Response(context)

    except Exception as e:
        print(e)
        return Response({'error': 'Error In Getting Your Devices!'}, status=400)





@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_device(request):
    try:
        if request.method != 'POST':
            return Response({'error' : 'Not a POST request!'}, status=400)
        else:
            data = request.data
            if data == '':
                return Response({'error': 'Cannot be empty!'}, status=400)

            Device.objects.create(user=request.user, name=data['name'])
            
            return Response({'message': 'Added Device Successful!'}, status=200)

    except Exception as e:
        print(e)
        return Response({'error': 'Error In Adding Device!'}, status=400)




@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_device(request):
    try:
        if request.method != 'PUT':
            return Response({'error' : 'Not a PUT request!'}, status=400)
        else:
            data = request.data
            if data == '':
                return Response({'error': 'Cannot be empty!'}, status=400)

            # Device.objects.create(user=request.user, name=data['name'])
            device = Device.objects.get(id=data['id'])
            device.name = data['name']
            device.save()

            return Response({'message': 'Updated Device Name Successful!'}, status=200)

    except Exception as e:
        print(e)
        return Response({'error': 'Error In Updating Device Name!'}, status=400)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def log_temperature(request):
    try:
        if request.method != 'POST':
            return Response({'error' : 'Not a POST request'})
        else:
            data = request.data
            
            if data == '':
                return Response({'error' : 'Cannot be empty'})

        temperature = round(random.uniform(-20, 50), 2)
        device = Device.objects.get(id=data['device_id'])
        TemperatureSensor.objects.create(device=device, temperature=temperature)

        return Response({'message' : 'successfully logged temperature data'})

    except Exception as e:
        print(e)
        return Response({'error' : 'error logging temperature data'})



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def log_pressure(request):
    try:
        if request.method != 'POST':
            return Response({'error' : 'Not a POST request'})
        else:
            data = request.data
            
            if data == '':
                return Response({'error' : 'Cannot be empty'})

        pressure = round(random.uniform(930, 1050), 2)
        device = Device.objects.get(id=data['device_id'])
        PressureSensor.objects.create(device=device, pressure=pressure)

        return Response({'message' : 'pressure logged sensor data'})

    except Exception as e:
        print(e)
        return Response({'error' : 'error logging pressure data'})




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_logs(request, device_id, start_range = 0, end_range = int(datetime.datetime.now().timestamp())):
    try:
        if request.method != 'GET':
            return Response({'error': 'not a GET request'})

        else:
            
            # start_date = int(start_range)/1000
            # print(start_date)
            # start = datetime.datetime.fromtimestamp(start_date)
            # # start = datetime.date.fromtimestamp(start_date)
            # print(start_range)
            # print(start)
            # print('-------------------')
            
            # end_date = int(end_range)/1000
            # end = datetime.datetime.fromtimestamp(end_date).replace(microsecond=0)
            # # end = datetime.date.fromtimestamp(end_date)
            # print(end)
            
            start = datetime.datetime.fromtimestamp(int(start_range))
            end = datetime.datetime.fromtimestamp(int(end_range))

            context = {}
            device = Device.objects.get(id=device_id)
            context['device_name'] = str(device.name)

            # temperatures = device.temperaturesensor_set.all().order_by('-id')
            temperatures = device.temperaturesensor_set.all().filter(log_time__gte=start, log_time__lte=end).order_by('-id')
            temp_serializer = TemperatureSensorSerializer(temperatures, many=True)
            context['temp_logs'] = temp_serializer.data
        
            # pressures = device.pressuresensor_set.all().order_by('-id')
            pressures = device.pressuresensor_set.all().filter(log_time__gte=start, log_time__lte=end).order_by('-id')
            pres_serializer = PressureSensorSerializer(pressures, many=True)
            context['pres_logs'] = pres_serializer.data

            # print('got logs')

        return Response(context)

    except Exception as e:
        print(e)
        return Response({'error': 'error getting device logs'})
        