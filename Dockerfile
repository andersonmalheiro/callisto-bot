FROM node:18-alpine as builder

WORKDIR /app
RUN chown -R node /app

COPY --chown=node:node . /app

RUN yarn install --frozen-lockfile && \
    yarn cache clean --force

RUN yarn build

FROM builder as release

COPY --from=builder --chown=node:node /app .
USER node
ENV NODE_ENV=production
ENV DISCORD_TOKEN=${DISCORD_TOKEN}
ENV GUILD_ID=${GUILD_ID}
CMD ["yarn", "serve"]
