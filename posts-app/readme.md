# OpenTelementry microservices PoC
## Application - Posts

### Description

The posts application makes up one of the microservices in this small PoC built to show case OpenTelemetry.

The posts app supports the following end points:
posts/:userId/:permission

It expects the userid and permission to exist within a postgreSql database which should have the following tables user, permisisons, userPermissions, posts and userPosts.

The application is intended to be deployed to a kubernetes environment hosting the services, along with the database and Jaeger OpenTelemetry end point.

### Installation
The application is not intended to be run locally and to this effect a dockerfile is included.

