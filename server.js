const express = require("express") //importing express package
const app = express() // creates a express application
const PORT = 3000

app.set('view engine','ejs')
app.use(express.static('public'))






// Routes go here
app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/garage',(req,res)=>{
    res.render('garage')
})

app.get('/system',(req,res)=>{
    res.render('system')
})
 




app.listen(3000,()=>{
    console.log('App is Running')
}) // listen on port 3000
