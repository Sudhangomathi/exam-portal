# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Spring Boot Backend
FROM maven:3.9-eclipse-temurin-17-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 3: Final Runtime
FROM eclipse-temurin:17-jre-alpine
RUN apk add --no-cache nodejs

WORKDIR /app

# Copy built frontend assets and backend JAR
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY --from=backend-builder /app/backend/target/*.jar ./backend.jar

# Copy Node server proxy and start orchestrator script
COPY server.js ./
COPY start.sh ./

# Make startup script executable
RUN chmod +x start.sh

# Expose port (Render dynamically sets PORT env variable, defaulting to 80 locally)
EXPOSE 80

CMD ["/bin/sh", "/app/start.sh"]
