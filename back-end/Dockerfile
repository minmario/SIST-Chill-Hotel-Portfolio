# ---- Stage 1: Build ----
FROM gradle:8.7.0-jdk17 AS build
WORKDIR /app
COPY . .
RUN gradle clean build --no-daemon

# ---- Stage 2: Run ----
FROM openjdk:17-jdk-slim
WORKDIR /app
# S3 연동 및 AWS SDK, Spring Cloud AWS 의존성은 build.gradle에 명시되어 있음
COPY --from=build /app/build/libs/*.jar app.jar
# (필요시) 환경변수로 AWS 키, DB 접속 정보 전달
ENV JAVA_OPTS=""
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
