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

# These three are the template rendering views
def dashboard_template(request):
    device_page = reverse('api_app:device_template', args=['device_id'])
    return render(request, 'api_app/dashboard.html', {'device_page': device_page})


def login(request):
    return render(request, 'api_app/login.html')


def device_template(request, device_id):
    return render(request, 'api_app/device.html', {'device_id': device_id})


# This view lists all available endpoints
@api_view(['GET'])
def api_endpoints(request):
    

    endpoints = {
        'api/': 'renders the dashboard template',
        'api/login/': 'renders the login page for submitting your credentials',
        'api/token/': 'POST method, submit credentials to retrieve auth token',
        'api/token/refresh/': 'returns a new auth token',
        'api/template/<device_id>/': 'renders the template for displaying the sensor data',
        '----  INFO  ----': 'THE FOLLOWING VIEWS REQUIRE AN AUTH TOKEN IN THE REQUEST HEADER',
        'api/dash_info/': 'GET method, returns all devices added by the user',
        'api/add/': 'POST method, creates a new devices in the db',
        'api/update/': 'PUT method, updates the name of the device',
        'api/temprature/': 'POST method, logs a data point into the temperatures table',
        'api/pressure/': 'POST method, logs a data point into the pressure table',
        'api/device/<device_id>/<start_range>/<end_range>/': 'GET method, needs a device id, start and end ranges are UNIX style timestamps',
    }

    return Response(endpoints)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_devices(request):
    '''
    This view retrieves all the devices added by the user.
    The request.user object is obtained by the token that is provided.
    '''

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
    '''
    This view is for adding a new device under a particular user
    '''
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
    '''
    This view is for updating the device name.
    Requires a device id in the body to retrieve the device that is to be updated
    '''
    try:
        if request.method != 'PUT':
            return Response({'error' : 'Not a PUT request!'}, status=400)
        else:
            data = request.data
            if data == '':
                return Response({'error': 'Cannot be empty!'}, status=400)

            # Device.objects.create(user=request.user, name=data['name'])
            device = Device.objects.get(id=data['id'], user=request.user)
            device.name = data['name']
            device.save()

            return Response({'message': 'Updated Device Name Successful!'}, status=200)

    except Exception as e:
        print(e)
        return Response({'error': 'Error In Updating Device Name!'}, status=400)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def log_temperature(request):
    '''
    This view is for logging the temperature for a device.
    Requires a device id.
    The temperature is a random decimal between -20.00 and 50.00.
    '''
    try:
        if request.method != 'POST':
            return Response({'error' : 'Not a POST request'})
        else:
            data = request.data
            
            if data == '':
                return Response({'error' : 'Cannot be empty'})

        temperature = round(random.uniform(-20, 50), 2)
        device = Device.objects.get(id=data['device_id'], user=request.user)
        TemperatureSensor.objects.create(device=device, temperature=temperature)

        return Response({'message' : 'successfully logged temperature data'})

    except Exception as e:
        print(e)
        return Response({'error' : 'error logging temperature data'})



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def log_pressure(request):
    '''
    This view is for logging the pressure for a device.
    Requires a device id.
    The pressure is a random decimal between 930.00 and 1050.00.
    '''
    try:
        if request.method != 'POST':
            return Response({'error' : 'Not a POST request'})
        else:
            data = request.data
            
            if data == '':
                return Response({'error' : 'Cannot be empty'})

        pressure = round(random.uniform(930, 1050), 2)
        device = Device.objects.get(id=data['device_id'], user=request.user)
        PressureSensor.objects.create(device=device, pressure=pressure)

        return Response({'message' : 'pressure logged sensor data'})

    except Exception as e:
        print(e)
        return Response({'error' : 'error logging pressure data'})




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_logs(request, device_id, start_range = 0, end_range = int(datetime.datetime.now().timestamp())):
    '''
    This view is for quering the temperature and pressure logs.
    It needs a device id, start range and range. These are UNIX style timestamps.
    '''
    try:
        if request.method != 'GET':
            return Response({'error': 'not a GET request'})

        else:
            
            start = datetime.datetime.fromtimestamp(int(start_range))
            end = datetime.datetime.fromtimestamp(int(end_range))

            context = {}
            device = Device.objects.get(id=device_id, user=request.user)
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
        