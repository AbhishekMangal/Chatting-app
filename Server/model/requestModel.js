const mongoose = require('mongoose');
const requestSchema  = new mongoose.Schema
({
    from:{
        type: String,
        require: true,
    },
    to:{
        type: String,
        require: true,
    },
    name: 
    {
        type: String,
        require: true
    },
    img:
    {
        type: String,
    }

})
module.exports = mongoose.model('request', requestSchema)