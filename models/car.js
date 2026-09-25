const mongoose = require('mongoose')
const carSchema = new mongoose.Schema({
    vin:String,
    isValid:Boolean
}, {timestemps:true})

module.exports = ('Car', carSchema)