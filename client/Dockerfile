# FROM node:16-alpine3.16

# #Install some dependencies

# ENV CI=true
# ENV WDS_SOCKET_PORT=0

# WORKDIR /usr/app
# COPY ./package.json ./
# RUN npm install
# COPY ./ ./

# # Set up a default command
# CMD [ "npm","start" ]
FROM node:16-alpine

ENV CI=true

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "start"]