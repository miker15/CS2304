FROM node:latest
LABEL authors="miker15@vt.edu"
WORKDIR /app
COPY . .
RUN npm install
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
    CMD curl -sS http://localhost:3000/api/health || exit 1
CMD nodemon Blabber.js