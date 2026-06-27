#!/bin/sh
# Start the backend Spring Boot JAR in the background
java -jar /app/backend.jar &

# Start the frontend Node.js server in the foreground
node /app/server.js
