import { FastifyInstance } from "fastify";
import {
  addUser,
  getUser,
  getAllUsersHandler,
  editUser,
  removeUser,
  getUserProfileData,
} from "../controllers/user.controller";

import {
  getChatMessages,
  sendMessage,
} from "../controllers/support.controller";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.post("/", addUser);

  fastify.get("/:id", getUser);

  fastify.get("/", getAllUsersHandler);

  fastify.put("/:id", editUser);

  fastify.get(
    "/me",
    { preHandler: [fastify.authenticate] },
    getUserProfileData
  );

  fastify.delete("/:id", removeUser);
  fastify.get(
    "/support/messages",
    { preHandler: [fastify.authenticate] },
    getChatMessages
  );
  fastify.post(
    "/support/messages",
    { preHandler: [fastify.authenticate] },
    sendMessage
  );
}
