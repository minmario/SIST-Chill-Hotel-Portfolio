FROM gradle:8.7.0-jdk17 AS build

WORKDIR /app

COPY . .

RUN gradle clean build -x test

FROM openjdk:17-jdk-slim

RUN apt-get update && apt-get install -y curl

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

COPY ../wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

ENTRYPOINT ["/wait-for-it.sh", "mysql:3306", "--", "java", "-jar", "app.jar"]