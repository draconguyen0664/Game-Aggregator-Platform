FROM eclipse-temurin:24-jre
WORKDIR /app
COPY target/studio-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java","-jar","app.jar"]
