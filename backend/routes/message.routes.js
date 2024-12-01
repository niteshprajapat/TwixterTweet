import express from 'express';
const router = express.Router();

import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { deleteMessage, getMessages, sendMessage, updateMessage } from '../controllers/message.controller.js';


router.post("/sendMessage/:id", isAuthenticated, sendMessage);
router.get("/getMessages/:id", isAuthenticated, getMessages);
router.put("/updateMessage/:id", isAuthenticated, updateMessage);
router.delete("/deleteMessage/:id", isAuthenticated, deleteMessage);



export default router;
