FROM eclipse-temurin:24-jre
WORKDIR /app
COPY target/api-key-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8091
ENTRYPOINT ["java","-jar","app.jar"]