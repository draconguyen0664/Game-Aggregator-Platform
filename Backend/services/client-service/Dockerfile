FROM eclipse-temurin:24-jre
WORKDIR /app
COPY target/client-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8087
ENTRYPOINT ["java","-jar","app.jar"]

