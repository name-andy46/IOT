# IOT
ShorelineIOT_assignment

## Endpoints

This is the list of all available endpoints in the application.
The following endpoints can be apended to this URL:

https://assignmentiot.pythonanywhere.com/
<br><br>



### api/ 

This path renders the dashboard template to view all devices once the user has been authenticated.

At the top of the page there will be a button that says `Add Device`. Clicking this button will open a modal asking you to enter the name for the device. Once you type in the name, click `Add` to create the device.

When the device has been successfully added, it will appear in the table below.
In the table you will see options to `Edit Name`, `View Device Data`, `Log Temperature` and `Log Pressure`.

Clicking the `Edit Name` button will open a modal with the name of the current device prepopulated in the text field. Once you have updated the name, click `Update` to save the new name.

The `View Device Data` will take you to the logs page, where you can see the sensor log data and query data for particular time period.

The `Log Temperature` and `Log Pressure` buttons log the temperature and pressure respectively. Here, this value is mocked by a random function.
<br><br>
### api/login/

Renders the login page for submitting your credentials. Once you submit valid credentials, you will be redirected to the dashboard page.
<br><br>

### api/template/<device_id>/
Renders the template for displaying the temperature and pressure sensor data that has been logged for that device whose id was submitted. It has two tables, one for temperature and one for pressure. There is also a query form to search for log data within a specified time period.
<br><br>


### api/token/
This is a POST method for submitting your credentials to. The username and password should be included in the body. Upon validation of the credentials, you will receive an access and refresh token. You will need to submit this access token in the request header for all api calls. If the access token is not provided, you get an error saying that you do not have permission. You do not need the access token for the previous views as they are just displaying the HTML templates.
<br><br>


### api/token/refresh/
Returns a new access token. Once the access token has expired the refresh token can be used to obtain a new valid access token.
<br><br>


### api/dash_info/
This is a GET method to query all the devices added by the user. It will only return devices that are added by the user.
<br><br>


### api/add/
This is a POST method for creating a new device. The name of the device should be in the body of the request.
<br><br>


### api/update/
This is a PUT method for updating the name of the device. The new name is sent in the body of the request.
<br><br>


### api/temprature/
This is a POST method for logging a data point into the temperature table for the provided device id. The device id is sent in the body of the request.
<br><br>


### api/pressure/
This is a POST method for logging a data point into the pressure table for the provided device id. The device id is sent in the body of the request.
<br><br>


### api/device/<device_id>/<start_range>/<end_range>/
This is a GET method for retrieving log data for a particular device. The need a device id, a start range and an end range. The time ranges should be UNIX style timestamps