FROM node:22-alpine3.21

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY api ./api

EXPOSE 3000

CMD ["npm", "start"]
