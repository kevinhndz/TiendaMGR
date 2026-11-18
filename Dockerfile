FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY img/ /usr/share/nginx/html/img/
COPY ["google568e52d863922e97 (1).html", "/usr/share/nginx/html/google568e52d863922e97.html"]

EXPOSE 80
