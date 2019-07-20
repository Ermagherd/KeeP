var mongoose = require('mongoose');
var Schema   = mongoose.Schema;


// function setSessionRole(req, res, next) {
//   console.log("read function")
//   if (req.session.role == null || req.session.role == undefined){
//     req.session.role = "visitor";
//     console.log("set role");
//   }
// }

// module.exports.roleValidation = [
//   setSessionRole
// ];

module.exports.landingPage = function (req, res, next) {

  if (!req.session.userId) {

    res.redirect('/account/login');

  } else {

    // TODO HERE COMES PARAMETERS !!!!
    // TODO HERE COMES PARAMETERS !!!!
    // TODO HERE COMES PARAMETERS !!!!
    // TODO HERE COMES PARAMETERS !!!!
    // TODO HERE COMES PARAMETERS !!!!

    res.redirect('/user/profile');

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