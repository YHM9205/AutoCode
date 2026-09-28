const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const indexRoutes = require("./routes/index.js");
const authRoutes = require("./routes/authRoutes.js");
const obdRoutes = require("./routes/obdRoutes.js");

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "auto-code-secret",
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

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use('/auth', authRoutes);
app.use('/obd', obdRoutes);
app.use('/', indexRoutes);

async function startServer() { 
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to Database");
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log("Listening on port " + PORT);
        });
    } catch (error) {
        console.log("Error Occured", error);
    }
}

startServer();
