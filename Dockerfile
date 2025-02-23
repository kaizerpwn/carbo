# Build Stage
FROM --platform=$BUILDPLATFORM node:20-alpine3.17 AS build
WORKDIR /app

# Instaliranje potrebnih build dependencies
RUN apk add --no-cache openssl openssl-dev git

# Kopiranje package fajlova i instalacija dependencies
COPY package*.json ./
RUN npm config set strict-ssl false && npm ci --loglevel verbose

# Kopiranje source koda
COPY . .

# Generisanje Prisma klijenta sa podrškom za sve platforme
RUN npx prisma generate
RUN npm run build

# Runtime Stage
FROM --platform=$TARGETPLATFORM node:18-alpine3.17 AS runtime
WORKDIR /app

# Instaliranje runtime dependencies
RUN apk add --no-cache openssl

# Kopiranje build artefakata
COPY --from=build /app/package*.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

# Osiguravanje da Prisma ima potrebne binaries
ENV PRISMA_QUERY_ENGINE_BINARY=/app/node_modules/@prisma/engines/query-engine-linux-musl-arm64-openssl-3.0.x
ENV PRISMA_SCHEMA_ENGINE_BINARY=/app/node_modules/@prisma/engines/schema-engine-linux-musl-arm64-openssl-3.0.x

# Exposing port
EXPOSE 3000

# Starting the application
CMD ["npm", "start"]