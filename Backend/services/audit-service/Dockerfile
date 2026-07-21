FROM eclipse-temurin:24-jre
WORKDIR /app
COPY target/audit-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8101
ENTRYPOINT ["java","-jar","app.jar"]