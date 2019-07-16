var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports.landingPage = function (req, res, next) {

  if (!req.session.userId) {

    res.redirect('/account/login');

  } else {

    // TODO HERE COMES PARAMETERS !!!!
    // TODO HERE COMES PARAMETERS !!!!
    // TODO HERE COMES PARAMETERS !!!!
    // TODO HERE COMES PARAMETERS !!!!
    // TODO HERE COMES PARAMETERS !!!!
    
    res.redirect('/dashboard');

  }


};

module.exports.dashboardPage = function (req, res, next) {
  let data = {

  };
  res
  .status(200)
  .render('dashboard.pug', {
    data: data
  });
};