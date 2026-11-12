FROM node:24-slim@sha256:dc26ae92c9fb15cf6b1d63e20f0944b2efe0f115b20e00be48fb23fceb061c54 AS base
WORKDIR /app
RUN corepack enable

FROM base AS builder
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY tsconfig.json vite.config.ts ./
COPY scripts ./scripts
COPY views ./views
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
