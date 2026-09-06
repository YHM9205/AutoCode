require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const ObdCode = require('./models/ObdCode')

const app = express()
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(MONGO_URI)
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log('[Mongoose]:, connected!')
    } catch (err) {
        console.log('[Mongoose Connection Error]:, err.message')
    }
};
connectDB();


// Routes go here
app.get('/', (req, res) => {
    res.render('index')
})


app.get('/system', (req, res) => {

    res.render('system', { result: null })
})


app.get('/diagnose', async (req, res) => {
    try {
        const code  = req.body
        if (!code) {
            return res.render('system', { result: { error: "please add the real code!" } })
        }
        const cleanCode = code.trim().toUpperCase()
        let record = await ObdCode.findOne({ code: cleanCode });
    
     if (!record) {
        record = new ObdCode({
            code: cleanCode,
            name: `Generated Profile for ${cleanCode}`,
            category: cleanCode.charAt(0),
            problem: "Dynamic / General Load Condition",
            solution: "Verify sensor reference voltage and wiring harness continuity",
            ghost_fix: "Inspacted_and_saved_via_mongoose"
        });
        await record.save();
    }

    res.render('system', { result: record });
} catch (error) {
    console.log('[Error]:', error.message);
    res.status(500).render('system', { result: { error: "ServerError!" } });
  }
});



app.listen(3000, () => {
    console.log('App is Running')
}) // listen on port 3000
