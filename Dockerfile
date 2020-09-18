FROM node:12
WORKDIR /code
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3010
CMD [ "npm", "start" ]