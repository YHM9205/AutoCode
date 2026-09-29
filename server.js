const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const morgan = require('morgan')
const session = require('express-session');
const methodOverride = require('method-override')
const {MongoStore} = require("connect-mongo");
const connectToDB = require('./config/db.js')

const isSignedIn = require("./middleware/isSignedIn.js");
const passUserToView = require("./middleware/passUserToView.js");

const indexRoutes = require("./routes/index.js");
const authRoutes = require("./routes/authRoutes.js");
const obdRoutes = require("./routes/obdRoutes.js");
const garageRoutes = require("./routes/garageRoutes.js");
const agentRoutes = require("./routes/agentRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

app.use(express.static('public'))
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
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);
app.use(passUserToView)

app.use('/auth', authRoutes)
app.use('/obd', obdRoutes)
app.use('/garage', isSignedIn, garageRoutes)
app.use('/agent', isSignedIn, agentRoutes)
app.use('/users', isSignedIn, userRoutes)
app.use('/', indexRoutes)

app.use((req, res) => {
    res.status(404).render('error.ejs', { message: 'Page not found' });
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).render('error.ejs', { message: 'Something went wrong' });
});

async function startServer() {
    const PORT = process.env.PORT || 3000;
    await connectToDB();

    app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });
}

startServer();
