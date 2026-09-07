FROM node:18-alpine as build
WORKDIR /usr/app
COPY package.json /usr/app
RUN npm install
RUN npm install pm2 -g

COPY . /usr/app
EXPOSE 8500

CMD ["pm2-runtime","start","./src/app.js"]
