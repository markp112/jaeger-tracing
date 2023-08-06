FROM nginx:1.17
COPY . .

RUN ls -a

COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080:8080
CMD ["nginx", "-g", "daemon off;"]