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
ENV JWT_SECRET="your-secret-key"
ENV DATABASE_URL="your-secret-key"
ENV OPENAI_API_KEY="your-secret-key"
CMD ["npm", "start"]