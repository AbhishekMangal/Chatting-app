const MessageModel = require("../model/MessageModel");

module.exports.addMessage = async(req, res, next)=>
{
    try {
        const {from, to, message} = req.body;
        const data = await MessageModel.create({
            message: {text: message},
            users: [from, to],
            sender: from,
        });
        if(data) return res.json({success: true, msz: "message Created Successfully"});
        return res.json({success: false, msz: "Failed to send message"});
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
        // console.log(messages);
        const projectMessage = messages.map((msg)=>
        {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            };
    });
     res.json(projectMessage);
    } catch (error) {
        next(ex);
    }
}