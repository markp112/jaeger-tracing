FROM nginx:1.23.1

# Replace the nginx.conf file with our own
COPY ./nginx-jaeger/nginx.conf /etc/nginx/nginx.conf

# Define the version of the NGINX OTel module
ARG OPENTELEMETRY_CPP_VERSION=1.0.3

# Define the search path for shared libraries used when compiling and running NGINX
ENV LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/opt/opentelemetry-webserver-sdk/sdk_lib/lib

# 1. Download the latest version of Consul template and the OTel C++ web server module, otel-webserver-module
ADD https://github.com/open-telemetry/opentelemetry-cpp-contrib/releases/download/webserver%2Fv${OPENTELEMETRY_CPP_VERSION}/opentelemetry-webserver-sdk-x64-linux.tgz /tmp

RUN apt-get update \
  && apt-get install -y --no-install-recommends dumb-init unzip \
# 2. Extract the module files
  && tar xvfz /tmp/opentelemetry-webserver-sdk-x64-linux.tgz -C /opt \
  && rm -rf /tmp/opentelemetry-webserver-sdk-x64-linux.tgz \
# 3. Install and add the 'load_module' directive at the top of the main NGINX configuration file
  && /opt/opentelemetry-webserver-sdk/install.sh \
  && echo "load_module /opt/opentelemetry-webserver-sdk/WebServerModule/Nginx/1.23.1/ngx_http_opentelemetry_module.so;\n$(cat /etc/nginx/nginx.conf)" > /etc/nginx/nginx.conf

# 4. Copy in the configuration file for the NGINX OTel module
COPY ./nginx-jaeger/opentelemetry_module.conf /etc/nginx/conf.d/opentelemetry_module.conf

COPY ./nginx/mime.types /etc/opt/rh/rh-nginx112/nginx/mime.types

RUN chgrp -R root /var/cache/nginx /var/run /var/log/nginx /var/opt && \
    chmod -R 770 /var/cache/nginx /var/run /var/log/nginx /var/opt

RUN mkdir -p /var/opt/rh/rh-nginx112/log/nginx
RUN mkdir -p /var/opt/rh/rh-nginx112/run/nginx
RUN  chgrp -R root /var/opt/rh/rh-nginx112/log/nginx /var/opt/rh/rh-nginx112/run/nginx && \
    chmod -R 770 /var/opt/rh/rh-nginx112/log/nginx /var/opt/rh/rh-nginx112/run/nginx

WORKDIR /var/opt/rh/rh-nginx112/log/nginx

RUN touch access.log
RUN touch error.log 

WORKDIR /var/opt/rh/rh-nginx112/run/nginx
RUN echo 1 >> nginx.pid

RUN  chgrp -R root /var/opt/rh/rh-nginx112/log/nginx/access.log /var/opt/rh/rh-nginx112/log/nginx/error.log /var/opt/rh/rh-nginx112/run/nginx && \
    chmod -R 770 /var/opt/rh/rh-nginx112/log/nginx/access.log /var/opt/rh/rh-nginx112/log/nginx/error.log  /var/opt/rh/rh-nginx112/run/nginx


EXPOSE 8085
# CMD ["nginx", "-g", "daemon off;"]
STOPSIGNAL SIGQUIT
