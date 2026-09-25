// imports
const express = require("express") //importing express package
const app = express() // creates a express application
const dotenv = require("dotenv").config() //this allows me to use my .env values in this file
const mongoose = require("mongoose")
const morgan = require("morgan")
const methodOverride = require("method-override")
const obdRoutes = require('./routes/obdRoutes')
const { validate } = require("./models/Owner")













// Middleware
app.use(express.static('public')); //all static files are in the public folder
app.use(express.urlencoded({ extended: false })); // this will allow us to see the data being sent in the POST or PUT
app.use(methodOverride("_method")); // Changes the method based on the ?_method
app.use(morgan("dev")) // logs the requests as they are sent to our sever in the terminal
app.use(express.json())


async function conntectToDB() { //connection to the database
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Database")
    }
    catch (error) {
        console.log("Error Occured", error)
    }
}


conntectToDB()



app.use('/', obdRoutes)

















// Routes go here
















app.listen(3000, () => {
    console.log("Listening on port " + 3000)
}) // Listen on port 3000


