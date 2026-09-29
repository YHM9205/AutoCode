// imports
const express = require("express") //importing express package
const app = express() // creates a express application
const dotenv = require("dotenv").config() //this allows me to use my .env values in this file
const morgan = require('morgan')
const session = require('express-session');
const methodOverride = require('method-override')
const {MongoStore} = require("connect-mongo");
const connectToDB = require('./config/db.js')

// middleware imports
const isSignedIn = require("./middleware/isSignedIn.js");
const passUserToView = require("./middleware/passUserToView.js");

// route imports
const indexRoutes = require("./routes/index.js");
const authRoutes = require("./routes/authRoutes.js");
const obdRoutes = require("./routes/obdRoutes.js");
const garageRoutes = require("./routes/garageRoutes.js");
const agentRoutes = require("./routes/agentRoutes.js");
const userRoutes = require("./routes/userRoutes.js");


// Middleware
app.use(express.static('public')) // my app will serve all static files from public folder
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'))
app.use(methodOverride('_method'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,

    store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions"
    }),

    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);
app.use(passUserToView)


// Routes go here
app.use('/auth', authRoutes)
app.use('/obd', obdRoutes)
app.use('/garage', isSignedIn, garageRoutes)
app.use('/agent', isSignedIn, agentRoutes)
app.use('/users', isSignedIn, userRoutes)
app.use('/', indexRoutes)


// connect to database and listen on Port 3000
async function startServer() {
    const PORT = process.env.PORT || 3000;
    await connectToDB();

    app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });
}

startServer();
