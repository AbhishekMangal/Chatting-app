const mongoose = require('mongoose');
const friendsSchema = new mongoose.Schema({
    
    users: Array

})
module.exports = mongoose.model('friend', friendsSchema);