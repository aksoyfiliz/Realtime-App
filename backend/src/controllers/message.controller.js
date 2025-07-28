import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js"
import { io, getReceiverSocketId } from "../lib/socket.js"

export const getUsersForSidebar = async (req,res)=>{
    try {
        const loggedUserId = req.user._id
        const filteredUsers = await User.find({_id: {$ne:loggedUserId}}).select("-password")
        
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in getUserForSidebar: ", error.message)
        res.status(500).json({ message: "Internal Server Error"})
    }
}

export const getMessages = async (req,res)=>{
    try {
        const { id } = req.params
        const userId = req.user._id

        const messages = await Message.find({
            $or: [
                {senderId: id, receiverId: userId},
                {senderId: userId, receiverId: id}
            ]
        })
        res.status(200).json(messages)

    } catch (error) {
        console.log("Error in getMessages: ", error.message)
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const sendMessage = async (req,res)=>{
    try {
        const { id: receiverId } = req.params
        const senderId = req.user._id
        const { text, image } = req.body

        let imageUrl
        if(image) {
            // Upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        if (!text && !image) {
            return res.status(400).json({message: "Please enter text or image"})
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save()

        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in sendMessage: ", error.message)
        res.status(500).json({message: "Internal Server Error"})
    }
}