const mongoose = require("mongoose")

async function connectToDB(){ //connection to the database
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to Database")
    }
    catch(error){
        // stop here, the app can not work without the database
        console.log("Could not connect to the database:", error.message)
        process.exit(1)
    }
}

module.exports = connectToDB