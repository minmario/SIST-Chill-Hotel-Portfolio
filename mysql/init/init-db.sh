#!/bin/bash
set -e

# docker-compose���� ������ ȯ�溯���� �״�� ���
mysql -u root -p"${MYSQL_ROOT_PASSWORD}" <<-EOSQL
  CREATE DATABASE IF NOT EXISTS chill;
  CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';
  GRANT ALL PRIVILEGES ON chill.* TO '${MYSQL_USER}'@'%';
  FLUSH PRIVILEGES;
EOSQL