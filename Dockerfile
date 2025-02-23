# Build Stage
FROM --platform=$BUILDPLATFORM node:20-alpine3.17 AS build
WORKDIR /app
COPY package*.json ./
RUN npm config set strict-ssl false && npm ci --loglevel verbose
COPY . .

# Pass secrets as build arguments
ARG JWT_SECRET
ARG DATABASE_URL
ARG OPENAI_API_KEY

# Set environment variables for the build stage
ENV JWT_SECRET=$JWT_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV OPENAI_API_KEY=$OPENAI_API_KEY

RUN npx prisma generate
RUN npm run build

# Runtime Stage
FROM --platform=$TARGETPLATFORM node:18-alpine3.17 AS runtime
WORKDIR /app
COPY --from=build /app ./
EXPOSE 3000

# Set environment variables for the runtime stage
ENV JWT_SECRET=$JWT_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV OPENAI_API_KEY=$OPENAI_API_KEY

CMD ["npm", "start"]
