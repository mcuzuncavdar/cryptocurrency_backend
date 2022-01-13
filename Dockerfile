FROM node
RUN npm install -g npm
RUN npm install -g nodemon

#RUN mkdir -p /var/www/html/node_modules && chown -R node:node /var/www/html

WORKDIR /var/www/html

COPY package*.json ./

#USER node

RUN npm install

#COPY --chown=node:node . .
COPY --chown=node:node . .

EXPOSE 8080

CMD [ "nodemon", "app.js" ]
