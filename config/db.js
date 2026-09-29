const mongoose = require("mongoose")

async function connectToDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to Database")
    }
    catch(error){
        console.log("Could not connect to the database:", error.message)
        process.exit(1)
    }
}

module.exports = connectToDB