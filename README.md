#Public 버전이라 배포용 프로젝트는 private으로 따로 있습니다

# SIST Chill Hotel
Spring Boot 기반 호텔 예약 시스템 백엔드 API

## 🔧 주요 기능
- JWT 기반 회원/스태프/관리자 로그인 및 인증
- 회원가입 및 마이페이지 구현
- 관리자 전용 페이지 UI 전체 구현
- 포인트 및 등급 시스템 구현
- Docker + Nginx + MySQL 기반 배포

## 🧑‍💻 담당 파트
- DB 설계 및 구축 참여
- 사용자, 관리자 로그인 및 회원가입 기능 구현
- 마이페이지 구현
- 관리자 페이지 UI 전체 개발
- 보안 및 접근제한 로직 구현
## 홈페이지
https://www.sistchillhotel.com/
## 🚀 실행 방법 (Docker 기반)

본 프로젝트는 Docker와 Docker Compose를 사용해 백엔드, 프론트엔드, MySQL, Nginx 환경을 동시에 실행할 수 있습니다.

### 1. 저장소 클론
```bash
git clone https://github.com/your-id/SIST-Chill-Hotel.git
cd SIST-Chill-Hotel-main
```

### 2. Docker 실행 (Docker Desktop 설치 필요)
```bash
docker-compose up --build
```

### 3. 접속 확인
- 프론트엔드: http://localhost
- 백엔드 API (Swagger 등): http://localhost:8080/swagger-ui/index.html (존재할 경우)
- MySQL: localhost:3306 (계정 정보는 docker-compose.yml 참고)

### 4. 종료
```bash
docker-compose down
```

## 📦 로컬 실행 (선택 사항)

> Docker가 아닌 직접 실행을 원하는 경우:

### 1. MySQL 실행 및 DB 생성
```sql
CREATE DATABASE chill_hotel DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. application.yml 설정 (`back-end/src/main/resources`)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/chill_hotel
    username: root
    password: [비밀번호]
  jwt:
    secret: [JWT-SECRET-KEY]
```

### 3. 백엔드 실행
```bash
./gradlew bootRun
```

### 4. 접속 주소
- http://localhost:8080


