-- MySQL DDL 스크립트 - Chill Haven 핵심테이블

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS chill_haven
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE chill_haven;
-- 사용자 테이블
CREATE TABLE users (
    user_idx BIGINT AUTO_INCREMENT PRIMARY KEY,
    id VARCHAR(100) UNIQUE NOT NULL,
    pwd VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE',
    role ENUM('user', 'staff', 'admin') NOT NULL DEFAULT 'user',
    joindate DATE NOT NULL DEFAULT (CURRENT_DATE)
);

-- 멤버십 테이블
CREATE TABLE membership (
    membership_idx BIGINT AUTO_INCREMENT PRIMARY KEY,
    membership_num VARCHAR(20) UNIQUE NOT NULL,
    user_idx BIGINT NOT NULL,
    tier ENUM('BASIC', 'PREMIUM', 'VIP') NOT NULL DEFAULT 'BASIC',
    required_point INT NOT NULL DEFAULT 0,
    required_stays INT NOT NULL DEFAULT 0
    -- FOREIGN KEY (user_idx) REFERENCES users(user_idx)
);

-- 멤버십 할인 테이블
CREATE TABLE membership_discount (
    membership_discount_idx BIGINT AUTO_INCREMENT PRIMARY KEY,
    tier ENUM('BASIC', 'PREMIUM', 'VIP') NOT NULL,
    type ENUM('room', 'dining', 'store') NOT NULL,
    discount_percentage DECIMAL(5,2) NOT NULL
    -- FOREIGN KEY (tier) REFERENCES membership(tier) -- 이 부분은 잘못된 참조였으므로 주석 처리
);

-- 결제 방법 테이블
CREATE TABLE payment_method (
    payment_method_idx BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_idx BIGINT NOT NULL,
    card_type VARCHAR(50) NOT NULL,
    last_four_digits VARCHAR(4) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    expire_date DATE NOT NULL,
    token VARCHAR(255) NOT NULL
    -- FOREIGN KEY (user_idx) REFERENCES users(user_idx)
);

-- 포인트 트랜잭션 테이블
CREATE TABLE point_transaction (
    point_transaction_idx BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_idx BIGINT NOT NULL,
    point INT NOT NULL,
    reference_idx BIGINT,
    reference_type VARCHAR(50),
    transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    -- FOREIGN KEY (user_idx) REFERENCES users(user_idx)
);

-- 객실 타입 테이블
CREATE TABLE room_types (
    room_types_idx BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_name VARCHAR(100) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    size INT NOT NULL,
    view_type VARCHAR(50) NOT NULL,
    max_adult INT NOT NULL,
    max_children INT NOT NULL,
    description TEXT NOT NULL,
    week_price DECIMAL(10,2) NOT NULL,
    weekend_price DECIMAL(10,2) NOT NULL,
    peak_week_price DECIMAL(10,2) NOT NULL,
    peak_weekend_price DECIMAL(10,2) NOT NULL,
    total_count INT NOT NULL
);

-- 객실 테이블
CREATE TABLE rooms (
    room_idx BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_types_idx BIGINT NOT NULL,
    room_num VARCHAR(10) UNIQUE NOT NULL,
    floor INT NOT NULL,
    status ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
    room_image VARCHAR(100) NOT NULL
    -- FOREIGN KEY (room_types_idx) REFERENCES room_types(room_types_idx)
);

-- 예약 테이블
CREATE TABLE reservation (
    reservation_idx BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_idx BIGINT NOT NULL,
    room_idx BIGINT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    adults INT NOT NULL,
    status ENUM('CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'CONFIRMED',
    total_amount DECIMAL(10,2) NOT NULL,
    payment_methods_idx BIGINT,
    reservation_num VARCHAR(20) UNIQUE NOT NULL,
    special_request TEXT
    -- FOREIGN KEY (user_idx) REFERENCES users(user_idx),
    -- FOREIGN KEY (room_idx) REFERENCES rooms(room_idx),
    -- FOREIGN KEY (payment_methods_idx) REFERENCES payment_method(payment_method_idx)
);

-- 식당 테이블
CREATE TABLE restaurants (
    restaurants_idx BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    open TIME NOT NULL,
    close TIME NOT NULL,
    location VARCHAR(255) NOT NULL
);

-- 고객 문의 테이블
CREATE TABLE QnA (
    qna_idx BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    email VARCHAR(255) NOT NULL,
    answer TEXT,
    write_date DATETIME NOT NULL,
    answer_date DATETIME
);

-- 기프트샵 테이블
CREATE TABLE gift_shop (
    item_idx BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 주문 테이블
CREATE TABLE orders (
    order_idx BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_idx BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    order_status ENUM('pending', 'paid', 'delivered', 'cancelled') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- FOREIGN KEY (user_idx) REFERENCES users(user_idx)
);

-- 주문 항목 테이블
CREATE TABLE order_items (
    order_item_idx BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_idx BIGINT NOT NULL,
    item_idx BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL
    -- FOREIGN KEY (order_idx) REFERENCES orders(order_idx),
    -- FOREIGN KEY (item_idx) REFERENCES gift_shop(item_idx)
);

-- 사용자 활동 로그 테이블
CREATE TABLE user_activity_log (
    log_idx BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_idx BIGINT NOT NULL,
    activity_type ENUM('hotel_reservation', 'password_change', 'payment', 'dining_reservation', 'payment_cancel', 'account_delete', 'login', 'logout') NOT NULL,
    activity_details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- FOREIGN KEY (user_idx) REFERENCES users(user_idx)
);

-- 추가 인덱스 생성
CREATE INDEX idx_reservation_dates ON reservation(check_in_date, check_out_date);
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_room_status ON rooms(status);