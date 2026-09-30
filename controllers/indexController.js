const { randomTip } = require('../utils/tips');

const index = (req, res) => {
    res.render("index.ejs", { tip: randomTip() });
};

module.exports = {
    index
};
