FROM eclipse-temurin:24-jre
WORKDIR /app
COPY target/game-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8088
ENTRYPOINT ["java","-jar","app.jar"]