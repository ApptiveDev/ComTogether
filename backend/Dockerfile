FROM gradle:8.7-jdk21-alpine as build

WORKDIR /app
COPY . .
RUN gradle clean build -x test


FROM openjdk:23-slim
WORKDIR /app
COPY --from=build /app/build/libs/*jar server.jar
CMD ["java", "-jar","./server.jar"]