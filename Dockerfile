FROM node:18-alpine as builder

WORKDIR /app

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --frozen-lockfile && \
    yarn cache clean --force

COPY --chown=node:node . .

RUN yarn build

# final image
FROM builder as release

COPY --from=builder --chown=node:node /app/dist .
COPY --from=builder --chown=node:node /app/package.json .
COPY --from=builder --chown=node:node /app/node_modules .

USER node

ENV NODE_ENV=production
ENV DISCORD_TOKEN=${DISCORD_TOKEN}
ENV GUILD_ID=${GUILD_ID}

CMD ["yarn", "serve"]
