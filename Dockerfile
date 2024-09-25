FROM node:alpine

RUN mkdir -p /usr/src/app/dist
WORKDIR /usr/src/app/

COPY package*.json /usr/src/app/

RUN npm install

ENV DB_CONN_STRING="mongodb://root:MongoDB2019!@mongo:27017/"
ENV DB_NAME="payment"
ENV APPOINTMENT_COLLECTION_NAME="payment"
ENV URL="http://localhost:8000"
ENV MQ_CONN_STRING="mq"
ENV GOOGLE_MAIL_APP_EMAIL="app_email"
ENV GOOGLE_MAIL_APP_PASSWORD="app_password"

COPY ./dist/ /usr/src/app/dist
COPY .env /usr/src/app

EXPOSE 8000

CMD ["npm", "start"]
