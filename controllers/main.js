module.exports.landingPage = function (req, res, next) {
    res
    .status(200)
    .send("This is our home page from controller");
};