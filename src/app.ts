import "dotenv/config";
import "express-async-errors"
import http from "http";
import cors from "cors";

import express, { Request, Response, NextFunction } from "express";
import { Server } from "socket.io";
import { router } from "./routes";

const app = express();

app.use(cors())
app.use(express.json());

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
    cors: {
        origin: "*"
    }
});

io.on("connection", socket => {
    console.log(`Usuário conectado no socket ${socket.id}`);
})

app.use('/nlw-heat', router);

app.get("/github", (request, response) => {
    response.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`)
})

app.get('/signin/callback', (request, response) => {
    const { code } = request.query;

    return response.json(code);
})

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if(err instanceof Error) {
        return response.status(400).json({
            error: err.message,
            backtrace: err.name
        })
    }
    return response.status(500).json({
        status: "error",
        message: "Internal Server Error"
    })
})

export { serverHttp, io }