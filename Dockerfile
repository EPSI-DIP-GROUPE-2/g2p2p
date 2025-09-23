FROM node:22.19.0-alpine3.22 AS builder

ENV HUSKY=0
ENV SUPPRESS_NO_CONFIG_WARNING=1

WORKDIR /build
COPY yarn.lock package*.json ./

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Install only prod deps into separate folder
RUN yarn install --frozen-lockfile --production --modules-folder /build/node_modules_prod

FROM node:22.19.0-alpine3.22 AS runner

ENV NODE_ENV=production

WORKDIR /app

# Copy only runtime deps, built files and metadata
COPY --from=builder /build/node_modules_prod ./node_modules
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/package.json ./
COPY --from=builder /build/config ./config
COPY --from=builder /build/static ./static

RUN chown -R node:node /app && chmod -R 700 /app
USER node

EXPOSE 3000
ENTRYPOINT ["node", "/app/dist/index.js"]
