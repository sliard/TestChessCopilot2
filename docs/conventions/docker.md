# Conventions Docker

## Variables d'environnement

- Utiliser `.env` pour les variables locales (jamais commité)
- Documenter dans `.env.example`
- Préfixer les variables Vite avec `VITE_`

### Exemple .env.example

```bash
# Database
POSTGRES_DB=appdb
POSTGRES_USER=appuser
POSTGRES_PASSWORD=changeme
DATABASE_URL=jdbc:postgresql://postgres:5432/appdb

# Backend
SPRING_PROFILES_ACTIVE=dev
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=86400000

# Frontend
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=My App
```

## Nommage des conteneurs

- Format : `app-{service}` ou `app-{service}-{env}`
- Exemples : `app-postgres`, `app-backend`, `app-frontend`

## Structure Docker Compose

```yaml
services:
  postgres:
    container_name: app-postgres
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    networks:
      - app-network

  backend:
    container_name: app-backend
    build:
      context: ../backend
      dockerfile: ../docker/Dockerfile.backend
    environment:
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE:-dev}
      SPRING_DATASOURCE_URL: ${DATABASE_URL}
    depends_on:
      - postgres
    ports:
      - "8080:8080"
    networks:
      - app-network

  frontend:
    container_name: app-frontend
    build:
      context: ../frontend
      dockerfile: ../docker/Dockerfile.frontend
      args:
        VITE_API_URL: ${VITE_API_URL}
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

## Dockerfile Backend

```dockerfile
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml ./
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## Dockerfile Frontend

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

