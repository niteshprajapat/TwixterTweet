import express from 'express';
const router = express.Router();

import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { getMessages, sendMessage, updateMessage } from '../controllers/message.controller.js';


router.post("/sendMessage/:id", isAuthenticated, sendMessage);
router.get("/getMessages/:id", isAuthenticated, getMessages);
router.put("/updateMessage/:id", isAuthenticated, updateMessage);



export default router;
