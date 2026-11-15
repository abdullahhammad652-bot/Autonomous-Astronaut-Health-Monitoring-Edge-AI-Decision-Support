# Production Dockerfile for AstroPulse High-Scale Telemetry System
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY server/ ./server
WORKDIR /app/server
RUN npm install --omit=dev

EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "index.js", "--cluster"]
