FROM eclipse-temurin:24-jre
WORKDIR /app
COPY target/version-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8092
ENTRYPOINT ["java","-jar","app.jar"]