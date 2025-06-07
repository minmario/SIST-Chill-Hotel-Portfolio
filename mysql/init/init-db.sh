#!/bin/bash
set -e

# docker-compose에서 주입한 환경변수를 그대로 사용
mysql -u root -p"${MYSQL_ROOT_PASSWORD}" <<-EOSQL
  CREATE DATABASE IF NOT EXISTS chill;
  CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';
  GRANT ALL PRIVILEGES ON chill.* TO '${MYSQL_USER}'@'%';
  FLUSH PRIVILEGES;
EOSQL