const mongoose = require('mongoose')

const obdCodeSchema = new mongoose.Schema({
    vin:{
        type:String,
        required:true,
        uppercase:true,
        trim: true

    },
    code:{
        type:String,
        required:true,
        uppercase:true,
        trim:true
    },
    category:{
        type:String,
        required:true,
        enum:['Powertrain', 'Body', 'Chassis','Network']
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'Active',
        enum:['Active', 'Resolved']
    },
    notes:{
        type:String,
        default:''
    }
},{
    timestamps:true
});

const ObdCode = mongoose.model('ObdCode', obdCodeSchema)

module.exports = ObdCode