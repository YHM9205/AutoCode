const mongoose = require('mongoose');

const obdCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    name:{
        type: String
    },
    category:{
        type: String
    },
    problem:{
    type: String
},
    solution:{
         type: String
         },
    partName:{
         type: String,
          default:'OEM Replacement Part'
        },
    estimatedPrice:{
         type: String,
          default: '$50.00'
        },
    storeLink:{
         type: String,
          default: 'https://www.rockauto.com'}
}, { timestamps: true });

module.exports = mongoose.model('ObdCode', obdCodeSchema);