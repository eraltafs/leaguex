const mongoose = require("mongoose");
require("dotenv").config()

const connection = async()=>{
  try {
    
   await mongoose.connect(process.env.MONGO_URI);
   console.log("connected to DB!")
  } catch (error) {
    console.log("Error connecting DB!", error);
  }
} 
module.exports = connection;
