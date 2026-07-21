FROM eclipse-temurin:24-jre
WORKDIR /app
COPY target/contract-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8096
ENTRYPOINT ["java","-jar","app.jar"]