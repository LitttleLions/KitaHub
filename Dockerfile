FROM node:20-slim

WORKDIR /app

COPY package*.json ./
# COPY bun.lockb ./ # Removed as we use npm and package-lock.json

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 8080

# Add health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080 || exit 1

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
