FROM eclipse-temurin:24-jre
WORKDIR /app
COPY target/auth-service-0.0.1-SNAPSHOT.jar app.jar
USER 10001
ENTRYPOINT ["java","-jar","/app/app.jar"]
