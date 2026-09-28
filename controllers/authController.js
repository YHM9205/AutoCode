const Owner = require("../models/Owner");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const ownerSignup = (req, res) => {
    res.render("auth/signup.ejs");
};

const signupUser = async (req, res) => {
    try {
        res.redirect("./cars/new");
    } catch (error) {
        console.log(error);
    }
};

const ownerLogin = (req, res) => {
    res.render("auth/login.ejs");
};

const loginUser = async (req, res) => {
    try {
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    ownerSignup,
    signupUser,
    ownerLogin,
    loginUser
};