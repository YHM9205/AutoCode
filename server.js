require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const ObdCode = require('./models/ObdCode')
const app = express() // creates a express application
const PORT = 3000
const myCars = [
    { model: 'Ford F-150', year: 2012, type: 'Pickup'},
    { model: 'Ford Taurus', year: 2012, type: 'Sedan'},
    { model: 'Mazda CX-9', year: 2018, type: 'SUV'}
]
app.set('view engine','ejs')
app.use(express.static('public'))








// Routes go here
app.get('/',(req,res)=>{
    res.render('index')
})



app.get('/system',(req,res)=>{
    const systemStatus = [
        { name: 'Engine Diagnostics', status: 'Optimal', code: 'P0000'},
        { name: 'Transmission Gearbox', status: 'need to change the clutches', code: 'P0920'},
        { name: 'Cooling System', status: 'stable', code: 'P0119'}
    ]
    res.render('system', {system: systemStatus})
})
 
app.get ('/garage',(req,res)=>{
    res.render('garage',{cars: myCars})
})



app.listen(3000,()=>{
    console.log('App is Running')
}) // listen on port 3000
