# Build Stage
FROM --platform=$BUILDPLATFORM node:20-alpine3.17 AS build
WORKDIR /app
COPY package*.json ./
RUN npm config set strict-ssl false && npm ci --loglevel verbose
COPY . .
RUN npx prisma generate
RUN npm run build

# Runtime Stage
FROM --platform=$TARGETPLATFORM node:18-alpine3.17 AS runtime
WORKDIR /app
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "start"]