import { Router } from "express";

import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { GetLast3MessagesController } from "./controllers/GetLast3MessagesController";
import { ProfileUserController } from "./controllers/ProfileUserController";
import { ensureAuthenticated } from "./middleware/ensureAuthenticated";

const router = Router();

router.post("/v1/authenticate", new AuthenticateUserController().handle)

router.post("/v1/messages", ensureAuthenticated, new CreateMessageController().handle)

router.get("/v1/messages/last3", new GetLast3MessagesController().handle)

router.get("/v1/profile", ensureAuthenticated, new ProfileUserController().handle)

export { router }