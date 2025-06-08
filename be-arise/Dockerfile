FROM maven:3.9.9-sapmachine-22 AS build

WORKDIR /app

COPY . .

USER root

RUN mvn install -Dmaven.test.skip=true && \ 
mvn package -Dmaven.test.skip=true

FROM eclipse-temurin:23.0.2_7-jre-alpine-3.21

WORKDIR /app

ENV APP_NAME=arise-0.0.1-SNAPSHOT.jar
ENV TZ=Asia/Saigon

COPY --from=build /app/target/${APP_NAME} .
COPY --from=build /app/client_secret.json .
COPY --from=build /app/service_user.json .
EXPOSE 8080

CMD ["sh", "-c" , "java -jar $APP_NAME"]
