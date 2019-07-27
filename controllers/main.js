var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var functions = require('./functions');

module.exports.landingPage = function (req, res, next) {

  let data = {};

  data.role = functions.checkRole(req);
  data.userName = functions.checkUserName(req);

  if (req.session.userName) {

    return res.redirect("/profile/" + req.session.userName);

  } else {

    res
    .status(200)
    .render('index', {
      data: data
    });
  }
};

module.exports.aboutPage = function (req, res, next) {

  let data = {};
  data.role = functions.checkRole(req);
  data.userName = functions.checkUserName(req);

  res
  .status(200)
  .render('about', {
    data: data
  });
};

module.exports.dashboardPage = function (req, res, next) {

  let data = {};
  data.role = functions.checkRole(req);
  data.userName = functions.checkUserName(req);

  res
  .status(200)
  .render('dashboard', {
    data: data
  });
};