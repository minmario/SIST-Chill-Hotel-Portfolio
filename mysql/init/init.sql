CREATE DATABASE IF NOT EXISTS chill;

CREATE USER IF NOT EXISTS 'hoteluser'@'%' IDENTIFIED BY 'MySecurePass123!';
GRANT ALL PRIVILEGES ON chill.* TO 'hoteluser'@'%';
FLUSH PRIVILEGES;