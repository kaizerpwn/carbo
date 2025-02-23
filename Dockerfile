# Build Stage
FROM --platform=$BUILDPLATFORM node:20-alpine3.17 AS build
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache openssl openssl-dev git

# Copy package files and install dependencies
COPY package*.json ./
RUN npm config set strict-ssl false && npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Runtime Stage
FROM --platform=$TARGETPLATFORM node:18-alpine3.17 AS runtime
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache openssl

# Copy necessary files from build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

# Create start script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'npx prisma migrate deploy && npm start' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose port
EXPOSE 3000

# Start the application
ENTRYPOINT ["/app/start.sh"]