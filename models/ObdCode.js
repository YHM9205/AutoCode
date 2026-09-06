const mongoose = require('mongoose')

const obdCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    problem:{
        type: String,
        String:true
    },
    solution:{
        type:String
    },

    ghost_fix: {
        type: String,
    },
    source:{
        type:String,default:'mongoose_core_database'
    }
   
},{
    timestamps: true
});

const ObdCode = mongoose.model('ObdCode', obdCodeSchema)

module.exports = ObdCode