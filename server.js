const express = require("express") //importing express package
const app = express() // creates a express application
const PORT = 3000


app.use(express.static('public'))


app.get('/', (req,res)=>{
    res.send('Welcome to AutoCode Server!')
})




// Routes go here


 




app.listen(3000,()=>{
    console.log('App is Running')
}) // listen on port 3000
