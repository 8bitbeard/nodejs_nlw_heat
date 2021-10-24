# FROM node:alpine

# WORKDIR /home/node/app

# COPY package*.json ./

# RUN npm i

# COPY . .

# CMD [ "npm", "run", "dev" ]

FrOM node:14

WORKDIR /home/node/app

COPY package.*json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

EXPOSE 4000

RUN chmod u+x ./docker-entrypoint.sh
CMD ["sh", "./docker-entrypoint.sh"]
# CMD [ "npm", "run", "dev" ]
# CMD ["docker-entrypoint.sh"]