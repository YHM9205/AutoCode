const ObdCode = require("../models/ObdCode")

const getAllCodes = async (req, res) => {
    try {
        const code = await ObdCode.find({})
        res.render('index', { cods })
    } catch (error) {
        res.send("Server Error")
    }
}
module.exports = {getAllCodes};