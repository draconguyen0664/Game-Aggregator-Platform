FROM eclipse-temurin:24-jre
WORKDIR /app
COPY target/billing-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8099
ENTRYPOINT ["java","-jar","app.jar"]