const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    message: {
        text: {
            type: String,
            require: true,
        },
    },
    users: Array,
    sender :{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
    },
    canSend :{
        type : Boolean,
        default: true,
    }
    },
    
    {
    timestamps: true,
    }
    
    
    
)

module.exports = mongoose.model('Message', messageSchema);