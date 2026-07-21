FROM eclipse-temurin:24-jre
WORKDIR /app
COPY target/entitlement-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8090
ENTRYPOINT ["java","-jar","app.jar"]