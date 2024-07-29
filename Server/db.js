const mongoose = require('mongoose');
require('dotenv').config();

const connectToMongo = async()=> {
    try {
        // console.log("c");
        // await mongoose.connect("mongodb+srv://abhishekmangal12345:Abhishek@cluster0.uhxsifh.mongodb.net/");
        await mongoose.connect("mongodb+srv://abhishekmangal12345:Abhishek@cluster0.uhxsifh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Connected Succefully");
    } catch (error) {
        console.error(error.message)
    }

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
module.exports = connectToMongo;