import { Chat } from "../models/chat-model.js";

const addMessge = async(req,res) => {
    const {to,message} = req.body
    const from = req.userId
    const formData = {
        message : {text:message},
        users : [from , to],
        sender : from
    }
    try{
        const data = await Chat.create(formData)
        if(data) return res.json ({msg:'message added'})
        return res.json({msg:"cannot add message"})
     }catch (error){
        console.log(error)
     }
}

const receiveMessage = async(req,res) => {
    const from  = req.userId
    const {to} = req.body
    try {
        const messages = await Chat.find({
            users : {
                $all : [from,to]
            }
        }).sort({updatedAt : 1})
        const projectedMsgs = messages.map((msg)=>{
            return {
                fromSelf : msg.sender.toString() === from,
                message : msg.message.text
            }
        })
       return res.json(projectedMsgs)
    }catch(error){
        throw error
    }
}

const chatController = {
    add: async(req,res)=>{
        return await addMessge(req,res)
    },
    receive: async(req,res)=>{
        return await receiveMessage(req,res)
    }
}

export default chatController