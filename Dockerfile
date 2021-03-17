FROM mhart/alpine-node:12 AS BUILD_IMAGE

WORKDIR /app

# Install Supporting Binaries for building
RUN apk --update add git less curl bash openssh && \
    rm -rf /var/lib/apt/lists/* && \
    rm -rf /var/cache/apk/*
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn run build && \
    npm prune --production

# Check Enviroment variables
RUN node dist/env.js

RUN node-prune

FROM mhart/alpine-node:slim-12

WORKDIR /app

COPY --from=BUILD_IMAGE /app/dist ./dist
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules

EXPOSE 8080

CMD NODE_ENV=production node dist/index.js