# Stage 1: Build
FROM node:25-alpine AS builder

WORKDIR /app

# Copy dependency files first for better layer caching
COPY package.json package-lock.json ./

# Install all dependencies (including dev deps needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM nginx:1.27-alpine AS runner

# Install wget for healthcheck (curl not available in nginx:alpine)
RUN apk add --no-cache wget

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Set proper ownership
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/run/nginx.pid

# Switch to non-root user
USER appuser

EXPOSE 3069

# Health check for container orchestrators
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3069/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
