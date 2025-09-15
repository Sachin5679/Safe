FROM node:18-alpine

RUN apk add --no-cache python3 make g++ git

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --build-from-source

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
