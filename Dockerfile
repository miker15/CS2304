FROM node:latest
LABEL authors="miker15@vt.edu"
WORKDIR /app
COPY . .
RUN npm install
CMD nodemon Blabber.js