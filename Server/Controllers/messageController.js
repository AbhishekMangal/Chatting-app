const MessageModel = require("../model/MessageModel");

module.exports.addMessage = async(req, res, next)=>
{
    try {
        const {from, to, message} = req.body;
        const messages = await MessageModel.find({
            users:{
                $all: [from, to]
            }
        }).sort({updated: 1});
        
        if(messages.length == 0 ||  messages[messages.length -1].canSend)
        {

        const data = await MessageModel.create({
            message: {text: message},
            users: [from, to],
            sender: from,
            
           
        });
        if(data) return res.json({success: true, msz: "message Created Successfully"});
        return res.json({success: false, msz: "Failed to send message"});
    }
    else
    {
        return res.json({success: true, msz:"You can't send the messages"});
    }
    } catch (error) {
        next(error);
    }
}
module.exports.getAllMessage = async(req, res, next)=>
{
    try {
        const {from ,to} = req.body;
        const messages = await MessageModel.find({
            users:{
                $all: [from, to]
            },
        }).sort({updated:1 });
     
        const projectMessage = messages.map((msg)=>
        {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
                canSend: msg.canSend,
                createdAt: msg.createdAt
            };
    });
    
     res.json(projectMessage);
    } catch (error) {
        next(error);
    }
}
module.exports.blockUser = async(req, res, next)=>
{
    try{
        const{from ,to} = req.body;
        const messages = await MessageModel.find({
            users:{
                $all: [from, to]
            }
        }).sort({updated: 1});
        if(messages.length == 0 || messages[messages.length -1].canSend)
        {
            const data = await MessageModel.create({
                message: {text: "Blocked"},
                users: [from, to],
                sender: from,
                canSend: false,
            });
            if(data) return res.json({success: true, msz: "Blocked SuccessFully"});

        }
        return res.json({success: false , msz:"Already Blocked"})



    }catch(error)
    {
        next(error);
    }
}
module.exports.unBlock = async(req, res, next)=>
{
    try {
        const {from, to} = req.body;
        const messages  = await MessageModel.find({
            users:{
                $all: [from, to]
            },
        }).sort({updated:1 });
        const lastMessage = messages[messages.length -1]
        if(lastMessage.canSend=== false && messages[messages.length -1].sender.toString() === from)
        {
            await MessageModel.deleteOne({
                canSend: false,
                users: {
                    $all: [from, to]
                }
            });
            return res.json({success: true, msz: "Unblocked Successfully" })
        }
        return res.json({success: false ,msz: "You can't perform this action"})
    } catch (error) {
        
    }
}