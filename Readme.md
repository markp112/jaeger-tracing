# OpenTelemetry - With Jaeger

This is a small demo project to show case the use of OpenTelemetry with Microservices using Jaeger as the collector.

The project consists of two simple NodeJs backends one representing the main API and the other a simplistic auth service which exists solely to provide a second service for the main service to call.

The auth service is expects to read a record from a postgre database called 'auth' with a single table 'User'.