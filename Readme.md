# OpenTelemetry - With Jaeger

This is a small demo project to show case the use of OpenTelemetry with Microservices using Jaeger as the collector.

The project consists of two simple NodeJs backends one representing the main API and the other a simplistic auth service which exists solely to provide a second service for the main service to call.

The main app can be found in the folder main-app and the auth similarly in the auth-app folder. Both apps contain a Dockerfile for deploying the services to a suitable host. This project was developed using OpenShift 4 Local cluster, but in principle it should work in other environments.

## Components

Both services expect to find a Jaeger host running at the following location 'http://jaeger-all-in-one-inmemory-collector.jaeger.svc:14268/api/traces' however this can be configured via the environment variable:

'JAEGER_END_POINT'

The auth service requires a postgreSql database to be available with a database 'auth' containing a table 'User'. The database connection string is configured via the environment variable:


The auth service is expects to read a record from a postgre database called 'auth' from a table called 'User'.

The database connection is confuigured via the environment variable 'DATABASE_URL' which creates the Prisma database connection when 'npx prisma generate' is run.

## Project Setup

### OpenShift

* Login into the Openshift UI as the kubeAdmin and add the following Operator 'Jaeger' provided by Redhat, Accept the defaults and create the Operator, this will take a few minutes to create.

* login back in as the 'developer'

* create a new project if one is not already existing

* Add the operator to the project by selecting +Add - operator backed and select the Jaeger Operator.
* Click on Create and accept the defaults, this should deploy the Jaeger operator




