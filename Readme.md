# OpenTelemetry - With Jaeger

This is a small demo project to show case the use of OpenTelemetry with microservices using Jaeger as the collector. It requires a Postgres database and a Jaeger end point to send traces to.

The project consists of three NodeJS service applications:

### main-app 
This is the primary application which will call the other two applications, it has the following endpoints:
* / - returns hello world to check everything is working
* /posts - returns all post by calling the post-app
* /posts/post-1 - this is to illustrate a circular route where one service calls another service which in turn calls back to the first service
* /posts/post-2 - this is the call back route for post-1
* /posts/user/:username - calls the auth app to authenticate before calling the post app to retrieve posts for a given user
* /posts/no-trace - does not implement any tracing beyond the http / express traces, it is there to illustrate the difference between having a trace and no trace.

Main app expects to run on port 3000
and should have the following environment variables configured:

AUTH_URL -  the end point of auth app
POST_URL - the end point of post app
JAEGER_URL (optional) - end point for Jaeger if different from  'http://jaeger-all-in-one-inmemory-collector.jaeger.svc:14268/api/traces'

### auth-app 
This is a dummy application to perform "authentication", it will read a validate if a user exists in the database and check their permissions - it has the following routes

* / - returns hello world to check everything is working
* /auth/user/:name - validates if the user exists in the database and returns the user name and id
* /auth/user/:id/permission/:permission - for a given user will check if they have a given permission and will return a permission record with the isGranted flag set to true / false depending on whether the permission is found.

Auth app expects to run on port 3010
and should have the following environment variables configured:

DATABASE_URL - end point for the postgresql database
JAEGER_URL (optional) - end point for Jaeger if different from  'http://jaeger-all-in-one-inmemory-collector.jaeger.svc:14268/api/traces'


### post-app
This app is there as third service to make the trace routes more interesting and support different scenarios it has the following routes

* / - returns hello world to check everything is working
* /posts - will retrieve all of the posts from the database
* /posts/:userId/:permission - returns the posts for a given user if the user has permission, it calls the auth app and is called by the main app route "/posts/user/:username" it illustrates a dual authentication
* /posts/posts-1 - this route is called by the main-app from /posts/post-1 it in turn calls the main app on the /posts-2 route

Post app expects to run on port 3012
and should have the following environment variables configured:

AUTH_URL -  the end point of auth app
MAIN_URL - the end point of main app
JAEGER_URL (optional) - end point for Jaeger if different from  'http://jaeger-all-in-one-inmemory-collector.jaeger.svc:14268/api/traces'
DATABASE_URL - end point for the postgresql database


The project is simply a PoC and does not follow any best practices, though is loosely adopts dependency inversion to pass services in to the controller. The services are constructed with an injected repository which can represent a database repository or another API end point. 

## Project Setup

All of the  services expect to send trace data to a Jaeger host running at the following location 'http://jaeger-all-in-one-inmemory-collector.jaeger.svc:14268/api/traces'. This is configurable via the enviroment variable
'JAEGER_END_POINT'.

The auth and post service require a postgreSql database to be available with a database 'auth' containing the following tables
User
UserPermissions
Permission
Post

An SQL script in the SQL folder will create these and populate them with some basic data.

Both services are configured by setting an enivronment variable DATABASE_URL which should configured as per below:

 DATABASE_URL=postgresql://<User>:<Password>@localhost:5432/auth?schema=public



### Local Setup
If using a Postgre instance hosted on Openshift, to connect to the database the following steps need to be followed:
Open terminal in the IDE:
1) set an environment variable for the DATABASE_URL, this needs to look for the database on localhost in the format of: 
   DATABASE_URL=postgresql://<User>:<Password>@localhost:5432/auth?schema=public
2) login into the oc console using your oc credentials which are obtained from the oc UI
3) For localhost to reach the postgres database on OpenShift we need to forward the port to the OpenShift pod running postgres, this can be located via the OpenShift UI and use this in the following command: oc port-foward <podname> 5432 & 
   1) The "&" is important here as we want the oc command to run in the background.
4) Add port forwarding for Jaeger if we need to capture the traces: oc port-forward <Jaeger pod name> 14268 & 
5) To forward requests to Jaeger each service needs its local environment variable for Jaeger_URL to be set to http://localhost:14268/api/traces
6) We can now build our application locally and start it

The project was built and tested to run in OpenShift, but has no specific dependencies on OpenShift

### OpenShift Configuration

* Login into the Openshift UI as the kubeAdmin and add the following Operator 'Jaeger' provided by Redhat, Accept the defaults and create the Operator, this will take a few minutes to create.

* login back in as the 'developer'

* create a new project if one is not already existing

* Add the operator to the project by selecting +Add - operator backed and select the Jaeger Operator.
* Click on Create and accept the defaults, this should deploy the Jaeger operator, if successful clicking on the OpenUrl on the Jaeger Pod in topology should open the Jaeger UI  which will look like the below:

![jaeger ui](./img/jaegerUI.png)

* Next using the Openshift template for PostgreSQL create a new Postgresql using +Add Database and selecting either the Postgresql or Postgresql Ephemeral. Leave the database service name as postgresql but change the PostgreSQL database name to auth. If using the non ephemeral version of Postgresql a persistent volume called 'postgresql' will need have been created before the instance can be created.

The user name and password can be set, or left to Openshift to create and then retrieved from secrets. These will be needed for the auth and post apps.

Once the database is running connect to the database and execute the sql script in from the sql folder.

* Each application has a Docker file from which it can be built:
* Using OpenShift we can add an item to the project, for each of the applications add an item from a gitrepo and follow the below steps
* Copy the git repo Url
* Select git advanced options and change the context dir to main-app for the first item and auth-app for the second one, in both cases it should find a docker file in these locations, change the "Name" to main-app and auth-app respectively.
* Target Port main app expects to listen on Port 3000 and auth-app on Port 3010 and post-app 3012 
* For the main-app opt to create a route, for the auth-app and post-app a route is not needed but can be added for testing purposes. The apps call the other "services" by using the service name the e.g.auth-app, post-app and main-app, this is configured via an environment variable in the main-app called 'AUTH_URL'. On Openshift this is simply the name of the auth-app service and port as in:
'http://auth-app:3010'.
* For the auth-app build an evironment variable called URL needs to be created the value for this should be:
DATABASE_URL=postgresql://<User>:<Password>@postgresql:5432/auth?schema=public
the user and password can be retrieved from the secrets within Openshift.

All being well you should now have three services running a PostgreSQL database and the Jaeger Operator.

