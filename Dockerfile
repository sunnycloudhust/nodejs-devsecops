FROM node
WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts 

COPY . .
EXPOSE 3000

USER node
ENTRYPOINT ["npm", "start"]
