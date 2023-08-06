FROM nginx:1.17

RUN ls -a

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/mime.types /etc/opt/rh/rh-nginx112/nginx/mime.types

RUN chgrp -R root /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 770 /var/cache/nginx /var/run /var/log/nginx


EXPOSE 8080:8080
CMD ["nginx", "-g", "daemon off;"]