FrOM node:14

WORKDIR /home/node/app

COPY package.*json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

EXPOSE 4000

RUN chmod u+x ./docker-entrypoint.sh
CMD ["sh", "./docker-entrypoint.sh"]