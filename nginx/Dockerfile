FROM nginx:1.17

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
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

EXPOSE 8080:8080
CMD ["nginx", "-g", "daemon off;"]
