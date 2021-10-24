# NodeJS NLW Heat API
This is a simple API made with NodeJS, developed during the RocketSeat Next Level Week Heat event.

# Documentation
The API documentation is hosted on Guthub Pages, and can be accessed on the link: https://8bitbeard.github.io/nodejs_nlw_heat/

# Techs Used
- NodeJS
- Prisma
- PostgreSQL
- Jest
- Docker
- Docker Compose
- Github Workflow

# Instaling the Development Environment

## If you have Docker and Docker Compose on your machine
- Clone this repository on yout machine
- cd into the repository folder, and build the docker images with docker-compose:
```bash
$ cd nodejs_nlw_heat

$ docker-compose up --build

#Or, if you want to run the containers on the background, use this command:
$ docker-compose up -d
```

After building the images, inspect the log to see if there are no errors

If you run the command to start the containers on the background, ou can run the following command, to check if the containers are really up:
```bash
$ docker-compose ps

NAME                    COMMAND                  SERVICE             STATUS              PORTS
nodejs_nlw_heat-api-1   "docker-entrypoint.s…"   api                 running             0.0.0.0:4000->4000/tcp, :::4000->4000/tcp
nodejs_nlw_heat-db-1    "docker-entrypoint.s…"   db                  running (healthy)   0.0.0.0:5198->5432/tcp, :::5198->5432/tcp
```

## If you dont have Docker and Docker Compose installed
- Install the LTS version of NodeJS. You can find it here: (https://nodejs.org/en/)
- After that, cd into the repository folder, and run the following command:

```bash
$ cd nodejs_nlw_heat

npm install
```

# Configuring the environment variables
- To run the NodeJS application, you will need to create a `.env` file on the root of the project with the following variables:

```sh
GITHUB_CLIENT_SECRET=<github_client_secret>
GITHUB_CLIENT_ID=<github_client_id>
JWT_SECRET=<jwt_secret>
DATABASE_URL=<postgres_database_url>
```

where:
- `GITHUB_CLIENT_SECRET` is the client secret of a OAuth app you will have to create on your github account (https://github.com/settings/developers). Obs: When creating the OAuth app, put the `http://localhost:4000` in the `Homepage URL` field, and `http://localhost:4000/signin/callback` on the `callback URL`
- `GITHUB_CLIENT_ID` is the client id from the same app you created on github
- `JWT_SECRET` is a personal key for encrypting jwt tokens, you can create your own
- `DATABASE_URL` is the URL for the postgres database (From docker or from your local machine)

# Starting the local server

To start the server, run the following command:
```bash
$ npm run dev
```
This will start the server on the port 4000 (url: http://localhost:4000)


# Running unit tests
This project is covered by Unit tests (soon to be from integration tests too), using `Jest`.

- To run the tests, run the following command:
```bash
# Using docker (If you didn't configured your local environment)
$ docker-compose exec api npm run test:unit

# On local development environment
$ npm run test:unit
```

# Github Workflow
A Github Workflow was implemented to run all the unit tests after a push is made to the main branch. Soon, i will implement a step to only deploy this aplication to Heroku, if all tests pass