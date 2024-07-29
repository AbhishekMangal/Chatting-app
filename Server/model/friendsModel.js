const mongoose = require('mongoose');
const friendsSchema = new mongoose.Schema({
    
    friendID: 
    {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        require: true
    },
    myId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        require : true,
    }

})
module.exports = mongoose.model('friend', friendsSchema);