FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY index.html /srv/index.html
COPY css/ /srv/css/
COPY js/ /srv/js/
COPY img/ /srv/img/
COPY ["google568e52d863922e97 (1).html", "/srv/google568e52d863922e97.html"]

EXPOSE 80 443
