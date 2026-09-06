FROM node:22-slim@sha256:689c11043dad91472750cd824c97dd5e2318e9dd6f954e492fe7af0135d33ceb AS base
WORKDIR /app
RUN corepack enable

FROM base AS builder
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY tsconfig.json ./
COPY src ./src
RUN pnpm run build

FROM base AS runtime
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=builder --chown=node:node /app/build ./build
RUN chown -R node:node /app
ENV PORT=3000
EXPOSE 3000
USER node
CMD ["node", "build/http.js"]
