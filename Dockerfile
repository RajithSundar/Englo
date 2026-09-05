# ==========================================
# STAGE 1: Build Frontend & Backend
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Build Vite client and esbuild server bundle
RUN npm run build

# ==========================================
# STAGE 2: Lightweight Production Runtime
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server ./dist-server

# Copy seed data directory
COPY --from=builder /app/data ./data

# Ensure data directory exists and set ownership for unprivileged execution
RUN mkdir -p /app/data && chown -R node:node /app

# Switch to non-root node user
USER node

# Expose standard Cloud Run HTTP port
EXPOSE 8080

# Launch production server
CMD ["node", "dist-server/server.js"]
