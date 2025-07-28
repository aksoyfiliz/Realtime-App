import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js"

const messageRoute = express.Router()

messageRoute.get("/users", protectRoute, getUsersForSidebar)
messageRoute.get("/:id", protectRoute, getMessages)
messageRoute.post("/send/:id", protectRoute, sendMessage)

export default messageRoute