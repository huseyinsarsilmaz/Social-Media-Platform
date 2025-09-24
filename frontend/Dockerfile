FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY .next ./.next
COPY node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]
