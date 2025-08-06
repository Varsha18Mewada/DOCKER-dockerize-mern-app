# Dockerfile for React client

# Build react client
FROM node:20.17-slim

# Working directory be app
WORKDIR /app

COPY package*.json ./

###  Installing dependencies

RUN npm install

# copy local files to app folder
COPY . .

EXPOSE 5000

CMD ["npm","start"]