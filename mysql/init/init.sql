-- 데이터베이스 생성 (docker-compose에서 이미 생성하고 있지만 확실히 하기 위해)
CREATE DATABASE IF NOT EXISTS chill;

-- 데이터베이스 선택
USE chill;

-- 사용자 생성 및 권한 부여 (필요한 경우)
-- 참고: docker-compose.yml에서 이미 MYSQL_USER와 MYSQL_PASSWORD로 사용자를 생성하고 있음
-- 추가 사용자가 필요한 경우 아래 주석을 해제하고 사용

-- CREATE USER IF NOT EXISTS 'app_user'@'%' IDENTIFIED BY 'secure_password';
-- GRANT ALL PRIVILEGES ON chill.* TO 'app_user'@'%';

-- 혹은 기존 사용자에게 권한 부여 (docker-compose에서 생성된 사용자)
GRANT ALL PRIVILEGES ON chill.* TO '${DB_USER}'@'%';

-- 권한 적용
FLUSH PRIVILEGES;

-- 기본 테이블 생성 (예시)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 기타 필요한 테이블 생성문 추가
-- 예: 호텔 관련 테이블, 예약 테이블 등