FROM --platform=linux/arm64 node:18

WORKDIR /app

COPY handler .

CMD [ "node","--trace-warnings", "--es-module-specifier-resolution=node", "/app/index.js" ]
