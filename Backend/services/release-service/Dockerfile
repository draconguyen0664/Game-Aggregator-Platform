FROM eclipse-temurin:24-jre
WORKDIR /app
COPY target/release-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8094
ENTRYPOINT ["java","-jar","app.jar"]