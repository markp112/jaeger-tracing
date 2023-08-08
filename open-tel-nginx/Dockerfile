FROM nginx:1.18
RUN apt-get update ; apt-get install unzip
ADD https://github.com/open-telemetry/opentelemetry-cpp-contrib/releases/download/webserver%2Fv1.0.0/opentelemetry-webserver-sdk-x64-linux.tgz.zip /opt
RUN cd /opt ; unzip opentelemetry-webserver-sdk-x64-linux.tgz.zip; tar xvfz opentelemetry-webserver-sdk-x64-linux.tgz
RUN cd /opt/opentelemetry-webserver-sdk; ./install.sh
ENV LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/opt/opentelemetry-webserver-sdk/sdk_lib/lib
RUN echo "load_module /opt/opentelemetry-webserver-sdk/WebServerModule/Nginx/ngx_http_opentelemetry_module.so;\n$(cat /etc/nginx/nginx.conf)" > /etc/nginx/nginx.conf
COPY ./open-tel-nginx/opentelemetry_module.conf /etc/nginx/conf.d

RUN mkdir -p /var/cache/nginx/client_temp
RUN mkdir /var/cache/nginx/proxy_temp

RUN chgrp -R root /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp && \
    chmod -R 770 /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp