FROM node:20-slim

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install --legacy-peer-deps

RUN npm run build

# Removed COPY . . to avoid overwriting node_modules and build output

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3002/api/health || exit 1

CMD ["npm", "run", "start"]
