FROM eclipse-temurin:24-jre
WORKDIR /app
COPY target/deployment-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8095
ENTRYPOINT ["java","-jar","app.jar"]