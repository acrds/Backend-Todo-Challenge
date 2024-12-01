FROM node:20

WORKDIR /app

COPY package.json ./
COPY src ./src
COPY .env ./
COPY entrypoint.sh ./
COPY tsconfig.json ./
COPY app.ts ./
COPY data ./

RUN apt-get update && apt-get install -y netcat-openbsd

RUN npm install

RUN chmod +x /app/entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["npx", "ts-node", "app.ts"]

