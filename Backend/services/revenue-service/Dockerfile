FROM eclipse-temurin:24-jre
WORKDIR /app
COPY target/revenue-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8097
ENTRYPOINT ["java","-jar","app.jar"]