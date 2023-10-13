FROM --platform=linux/arm64 node:18

WORKDIR /app

COPY handler handler

CMD [ "node","--trace-warnings", "--es-module-specifier-resolution=node", "/app/handler/index.js" ]
