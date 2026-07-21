FROM eclipse-temurin:24-jre
WORKDIR /app
COPY target/incident-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8102
ENTRYPOINT ["java","-jar","app.jar"]