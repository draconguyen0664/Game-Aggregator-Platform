FROM eclipse-temurin:24-jre
WORKDIR /app
COPY target/feature-flag-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8103
ENTRYPOINT ["java","-jar","app.jar"]