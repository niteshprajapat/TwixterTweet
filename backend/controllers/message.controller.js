import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";


// sendMessage
export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Required!",
            });
        }

        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Please provide receiverId!",
            });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = await Message.create({
            message,
            senderId,
            receiverId,
        });

        if (newMessage) {
            conversation.messages.push(newMessage);
        }


        await conversation.save();
        await newMessage.save();

        // socket implementation

        return res.status(201).json({
            success: true,
            message: "Message Sent!",
            message: newMessage,
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// getMessages
export const getMessages = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.user._id;

        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Please provide receiverId!",
            });
        }

        const conversation = await Conversation.find({
            participants: { $all: [senderId, receiverId] }
        }).populate({
            path: "messages",
        });


        if (!conversation) {
            return res.status(200).json({
                success: true,
                message: "No Conversation!",
                messages: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: "Messages Fetched Successfully",
            messages: conversation
        })



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// updateMessage
export const updateMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const messageId = req.params.id;
        const senderId = req.user._id;

        const updateMessage = await Message.findById(messageId);

        if (!updateMessage) {
            return res.status(400).json({
                success: false,
                message: "Message Not found with this ID",
            });
        }

        await Message.findByIdAndUpdate(messageId, { $set: { message } }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Message Updated",
            updateMessage,
        });





    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}