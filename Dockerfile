# Use the official OpenJDK image as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the jar file from the target directory into the container
COPY target/shop-0.0.1-SNAPSHOT.jar app.jar


# Command to run the application
CMD ["java", "-jar", "app.jar"]
