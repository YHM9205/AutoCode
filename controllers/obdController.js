const ObdCode = require("../models/Diagnostic")

const getAllCodes = async (req, res) => {
    try {
        const codes = await ObdCode.find({})
        res.render('index', { codes })
    } catch (error) {
        res.send("Server Error")
    }
}
module.exports = {getAllCodes};