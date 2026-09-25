const express = require("express");
const router = express.Router();
const Owner = require("../models/Owner");
const User = require("../models/User");
const bcrypt = require("bcrypt");


const ownerSingup = (req,res)=>{
    res.render("auth/signup.ejs")
}

const signupUser = (req,res)=>{
    try{
        res.redirect("./cars/new")
    } catch (error) {
        
    }
}