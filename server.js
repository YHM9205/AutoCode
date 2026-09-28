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
const garageRoutes = require("./routes/garageRoutes.js");
const reportRoutes = require("./routes/reportRoutes.js");
const isSignedIn = require("./middleware/isSignedIn.js");

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

async function startServer() { 
    try {
        if (!process.env.SESSION_SECRET) {
            throw new Error("SESSION_SECRET environment variable is required");
        }
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is required");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to Database");

        app.use(
            session({
                secret: process.env.SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
                store: MongoStore.create({
                    mongoUrl: process.env.MONGODB_URI,
                    collectionName: "sessions"
                }),
                cookie: {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: process.env.NODE_ENV === "production",
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
        app.use('/garage', isSignedIn, garageRoutes);
        app.use('/reports', isSignedIn, reportRoutes);
        app.use('/', indexRoutes);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log("Listening on port " + PORT);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exitCode = 1;
    }
}

startServer();
