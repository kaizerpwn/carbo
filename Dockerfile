FROM --platform=$BUILDPLATFORM node:20-alpine3.17 AS build
WORKDIR /app

RUN apk add --no-cache openssl openssl-dev git

COPY package*.json ./
RUN npm config set strict-ssl false && npm ci --loglevel verbose

COPY . .

RUN npx prisma generate
RUN npm run build

FROM --platform=$TARGETPLATFORM node:18-alpine3.17 AS runtime
WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=build /app/package*.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

ENV PRISMA_QUERY_ENGINE_BINARY=/app/node_modules/@prisma/engines/query-engine-linux-musl-arm64-openssl-3.0.x
ENV PRISMA_SCHEMA_ENGINE_BINARY=/app/node_modules/@prisma/engines/schema-engine-linux-musl-arm64-openssl-3.0.x

EXPOSE 3000

COPY <<EOF /app/start.sh
#!/bin/sh
echo "Running database migrations..."
npx prisma migrate deploy
echo "Starting the application..."
npm start
EOF

RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]