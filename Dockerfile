FROM node:22-slim@sha256:689c11043dad91472750cd824c97dd5e2318e9dd6f954e492fe7af0135d33ceb AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-slim@sha256:689c11043dad91472750cd824c97dd5e2318e9dd6f954e492fe7af0135d33ceb
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder --chown=node:node /app/build ./build
RUN chown -R node:node /app
ENV PORT=3000
EXPOSE 3000
USER node
CMD ["node", "build/http.js"]
