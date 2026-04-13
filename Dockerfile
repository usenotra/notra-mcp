FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY tsconfig.json ./
COPY src ./src
RUN bun run build

FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --production
COPY --from=builder /app/build ./build
ENV PORT=3000
EXPOSE 3000
CMD ["bun", "build/http.js"]
