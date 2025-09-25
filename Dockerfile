FROM node:22.19.0-alpine3.22 AS builder

RUN apk add --no-cache python3 make g++

ENV HUSKY=0
ENV SUPPRESS_NO_CONFIG_WARNING=1

WORKDIR /build
COPY yarn.lock package*.json ./

RUN yarn install --frozen-lockfile
RUN sed -i '/Gun\.log\.once("welcome"/d' node_modules/gun/gun.js

COPY . .
ENV NODE_ENV=production
RUN yarn build
RUN yarn build:static


FROM node:22.19.0-alpine3.22 AS runner

RUN apk add --no-cache python3 make g++

ENV NODE_ENV=production

WORKDIR /app

# Copy only runtime deps, built files and metadata
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/package.json ./
COPY --from=builder /build/config ./config
COPY --from=builder /build/static ./static

RUN chown -R node:node /app && chmod -R 700 /app && mkdir /etc/opt/echo -p && mkdir /var/opt/echo -p && chown -R node:node /etc/opt/echo && chmod -R 0700 /etc/opt/echo && chown -R node:node /var/opt/echo && chmod -R 0700 /var/opt/echo
USER node

EXPOSE 3000
ENTRYPOINT ["node", "/app/dist/index.js"]
