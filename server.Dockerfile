# Copyright 2021 - 2023 Transflox LLC. All rights reserved.

FROM --platform=linux/arm64 node:18

WORKDIR /app

RUN npm install -g pnpm

COPY package.json .
COPY pnpm-*.yaml .
COPY node_modules .

COPY handler handler

RUN pnpm install

CMD [ "node","--trace-warnings", "--es-module-specifier-resolution=node", "/app/handler/index.js" ]
