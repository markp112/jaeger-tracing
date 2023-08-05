FROM nginx:1.17
COPY . .

COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080:8080
CMD ["nginx", "-g", "daemon off;"]