const mongoose = require('mongoose');
require('dotenv').config();

const connectToMongo = async(username, password)=> {
    try {
       
        await mongoose.connect(`mongodb+srv://${username}:Abhishek@cluster0.uhxsifh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
        console.log("Connected Succefully");
    } catch (error) {
        console.error(error.message)
    }


}
module.exports = connectToMongo;