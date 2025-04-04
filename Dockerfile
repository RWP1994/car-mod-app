FROM node:18

WORKDIR /app

COPY ./car-customizer/server/package*.json ./
RUN npm install

COPY ./car-customizer/server .

EXPOSE 3001

CMD ["node", "index.js"]
