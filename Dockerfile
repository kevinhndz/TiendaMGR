FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY index.html /app/index.html
COPY css/ /app/css/
COPY js/ /app/js/
COPY img/ /app/img/
COPY ["google568e52d863922e97 (1).html", "/app/google568e52d863922e97.html"]

EXPOSE 80 443
