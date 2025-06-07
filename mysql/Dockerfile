FROM mysql:8.0

COPY ./conf /etc/mysql/conf.d
COPY ./init/init-db.sh /docker-entrypoint-initdb.d/init-db.sh

RUN chmod +x /docker-entrypoint-initdb.d/init-db.sh