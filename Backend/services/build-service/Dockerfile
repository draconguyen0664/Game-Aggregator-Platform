FROM eclipse-temurin:24-jre
WORKDIR /app
COPY target/build-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8093
ENTRYPOINT ["java","-jar","app.jar"]