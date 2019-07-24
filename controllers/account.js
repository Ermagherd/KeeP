const SESS_NAME = "sid";
const functions = require('./functions');

/*
.##.....##....###....##.......####.########.....###....########..#######..########.
.##.....##...##.##...##........##..##.....##...##.##......##....##.....##.##.....##
.##.....##..##...##..##........##..##.....##..##...##.....##....##.....##.##.....##
.##.....##.##.....##.##........##..##.....##.##.....##....##....##.....##.########.
..##...##..#########.##........##..##.....##.#########....##....##.....##.##...##..
...##.##...##.....##.##........##..##.....##.##.....##....##....##.....##.##....##.
....###....##.....##.########.####.########..##.....##....##.....#######..##.....##
*/
const { check, body, validationResult } = require("express-validator");

/*
.##.....##..#######..##....##..######....#######...#######...######..########
.###...###.##.....##.###...##.##....##..##.....##.##.....##.##....##.##......
.####.####.##.....##.####..##.##........##.....##.##.....##.##.......##......
.##.###.##.##.....##.##.##.##.##...####.##.....##.##.....##..######..######..
.##.....##.##.....##.##..####.##....##..##.....##.##.....##.......##.##......
.##.....##.##.....##.##...###.##....##..##.....##.##.....##.##....##.##......
.##.....##..#######..##....##..######....#######...#######...######..########
*/
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

// var userSchema = new Schema({
//   firstName   : { type: String, required: true },
//   lastName    : { type: String, required: true },
//   username    : { type: String, required: true },
//   email       : { type: String, required: true },
//   password    : { type: String, required: true },
//   creationDate: { type: Date, default: Date.now() }
// });

const accountSchemas = require('../models/account');
const user = mongoose.model("user", accountSchemas.userSchema);

/*
.########...######..########..##....##.########..########
.##.....##.##....##.##.....##..##..##..##.....##....##...
.##.....##.##.......##.....##...####...##.....##....##...
.########..##.......########.....##....########.....##...
.##.....##.##.......##...##......##....##...........##...
.##.....##.##....##.##....##.....##....##...........##...
.########...######..##.....##....##....##...........##...
*/
const bcrypt = require("bcrypt");
const saltRounds = 10;

/*
.##........#######...######...####.##....##.....######...########.########
.##.......##.....##.##....##...##..###...##....##....##..##..........##...
.##.......##.....##.##.........##..####..##....##........##..........##...
.##.......##.....##.##...####..##..##.##.##....##...####.######......##...
.##.......##.....##.##....##...##..##..####....##....##..##..........##...
.##.......##.....##.##....##...##..##...###....##....##..##..........##...
.########..#######...######...####.##....##.....######...########....##...
*/
module.exports.loginPage = function(req, res, next) {
  console.log("loginPage (GET) :");

  let data = {};
  data.role = functions.checkRole(req);
  data.userName = functions.checkUserName(req);

  res.status(200).render("loginPage", {
    data: data,
    message: req.flash("wrong login")
  });
};

/*
.##........#######...######...####.##....##....####.##....##....##.....##....###....##.......####.########.....###....########..#######..########.
.##.......##.....##.##....##...##..###...##.....##..###...##....##.....##...##.##...##........##..##.....##...##.##......##....##.....##.##.....##
.##.......##.....##.##.........##..####..##.....##..####..##....##.....##..##...##..##........##..##.....##..##...##.....##....##.....##.##.....##
.##.......##.....##.##...####..##..##.##.##.....##..##.##.##....##.....##.##.....##.##........##..##.....##.##.....##....##....##.....##.########.
.##.......##.....##.##....##...##..##..####.....##..##..####.....##...##..#########.##........##..##.....##.#########....##....##.....##.##...##..
.##.......##.....##.##....##...##..##...###.....##..##...###......##.##...##.....##.##........##..##.....##.##.....##....##....##.....##.##....##.
.########..#######...######...####.##....##....####.##....##.......###....##.....##.########.####.########..##.....##....##.....#######..##.....##

*/module.exports.validateLogin = [
  check("email", "email didn't match requirements")
    .isEmail()
    .normalizeEmail()
    .trim()
    .escape(),
  check("password", "Password didn't match requirements")
    .not()
    .isEmpty()
    .isLength({ min: 8, max: 50 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{7,}$/, "i")
    .trim()
    .escape()
];

/*
.##........#######...######...####.##....##....########...#######...######..########
.##.......##.....##.##....##...##..###...##....##.....##.##.....##.##....##....##...
.##.......##.....##.##.........##..####..##....##.....##.##.....##.##..........##...
.##.......##.....##.##...####..##..##.##.##....########..##.....##..######.....##...
.##.......##.....##.##....##...##..##..####....##........##.....##.......##....##...
.##.......##.....##.##....##...##..##...###....##........##.....##.##....##....##...
.########..#######...######...####.##....##....##.........#######...######.....##...
*/

module.exports.userLogin = function(req, res, next) {

  console.log("userLogin (POST) :");
  const { email, password } = req.body;
  let data = {};

  // * CHECK DATA VALIDITY AND REDIRECT IF FAILED

  const errors = validationResult(req);
  console.log(errors.array());

  if (!errors.isEmpty()) {
    let errorsMessages = "";
    errors.array().forEach(element => {
      errorsMessages += element.msg + ". ";
    });
    req.flash(
      "wrong login",
      "Something went wrong with your login (" +
        errorsMessages +
        "). Please try again."
    );
    return res.redirect("/account/login");
  }

  // * CHECK FOR USER IN DB (EMAIL)

  function verifyLogin() {
    user.findOne({ email: email }).exec(function(err, result) {
      if (err) throw err;
      console.log("result is : " + result);
      var accountPassword = result.password;
      var passwordTest    = bcrypt.compareSync(password, accountPassword);
      if (passwordTest) {
        req.session.userId   = result._id;
        req.session.role     = result.role;
        req.session.userName = result.username;
        return res.redirect("/");
      } else {
        req.flash("wrong login", "Invalid Password. Please try again");
        return res.redirect("/account/login");
      }
    });
  }

  verifyLogin();
};

/*
..######..####..######...##....##....####.##....##.....######...########.########
.##....##..##..##....##..###...##.....##..###...##....##....##..##..........##...
.##........##..##........####..##.....##..####..##....##........##..........##...
..######...##..##...####.##.##.##.....##..##.##.##....##...####.######......##...
.......##..##..##....##..##..####.....##..##..####....##....##..##..........##...
.##....##..##..##....##..##...###.....##..##...###....##....##..##..........##...
..######..####..######...##....##....####.##....##.....######...########....##...
*/

module.exports.signupPage = function(req, res, next) {
  console.log("signupPage (GET) :");

  let data = {};
  data.role = functions.checkRole(req);
  data.userName = functions.checkUserName(req);

  res.status(200).render("signupPage", {
    data: data,
    message: req.flash("wrong signup")
  });
};

/*
..######..####..######...##....##....####.##....##....##.....##....###....##.......####.########.....###....########..#######..########.
.##....##..##..##....##..###...##.....##..###...##....##.....##...##.##...##........##..##.....##...##.##......##....##.....##.##.....##
.##........##..##........####..##.....##..####..##....##.....##..##...##..##........##..##.....##..##...##.....##....##.....##.##.....##
..######...##..##...####.##.##.##.....##..##.##.##....##.....##.##.....##.##........##..##.....##.##.....##....##....##.....##.########.
.......##..##..##....##..##..####.....##..##..####.....##...##..#########.##........##..##.....##.#########....##....##.....##.##...##..
.##....##..##..##....##..##...###.....##..##...###......##.##...##.....##.##........##..##.....##.##.....##....##....##.....##.##....##.
..######..####..######...##....##....####.##....##.......###....##.....##.########.####.########..##.....##....##.....#######..##.....##
*/

module.exports.validateUserCreation = [
  check("firstName", "firstName didn't match requirements")
    .not()
    .isEmpty()
    .matches(/^[A-zÀ-ÖØ-öø-ÿ]+$/, "i")
    .isLength({ min: 1, max: 30 })
    .trim()
    .escape(),
  check("lastName", "firstName didn't match requirements")
    .not()
    .isEmpty()
    .matches(/^[A-zÀ-ÖØ-öø-ÿ]+$/, "i")
    .isLength({ min: 1, max: 30 })
    .trim()
    .escape(),
  check("username", "username didn't match requirements")
    .not()
    .isEmpty()
    .matches(/^[A-zÀ-ÖØ-öø-ÿ0-9]+$/, "i")
    .isLength({ min: 3, max: 20 })
    .trim()
    .escape(),
  check("email", "email didn't match requirements")
    .isEmail()
    .normalizeEmail()
    .trim()
    .escape(),
  check("password", "Password didn't match requirements")
    .not()
    .isEmpty()
    .isLength({ min: 8, max: 50 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{7,}$/, "i")
    .trim()
    .escape(),
  check(
    "passwordConfirmation",
    "Password Confirmation didn't match requirements"
  )
    .not()
    .isEmpty()
    .isLength({ min: 8, max: 50 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{7,}$/, "i")
    .trim()
    .escape()
];

/*
..######..####..######...##....##....####.##....##....########...#######...######..########
.##....##..##..##....##..###...##.....##..###...##....##.....##.##.....##.##....##....##...
.##........##..##........####..##.....##..####..##....##.....##.##.....##.##..........##...
..######...##..##...####.##.##.##.....##..##.##.##....########..##.....##..######.....##...
.......##..##..##....##..##..####.....##..##..####....##........##.....##.......##....##...
.##....##..##..##....##..##...###.....##..##...###....##........##.....##.##....##....##...
..######..####..######...##....##....####.##....##....##.........#######...######.....##...
*/

module.exports.createUser = function(req, res, next) {
  console.log("createUser (POST) :");
  const { firstName, lastName, username, email, password } = req.body;
  let data = {};
  data.role = functions.checkRole(req);
  data.userName = functions.checkUserName(req);

  // * CHECK DATA VALIDITY AND REDIRECT IF FAILED

  const errors = validationResult(req);
  // console.log(errors.array());

  if (!errors.isEmpty()) {
    let errorsMessages = "";
    errors.array().forEach(element => {
      errorsMessages += element.msg + ". ";
    });
    req.flash(
      "wrong signup",
      "Something went wrong with your account creation (" +
        errorsMessages +
        "). Please try again."
    );
    return res.redirect("/account/signup");
  }

  // * GLOBAL USER MODEL

  // var user = mongoose.model('user', userSchema );

  // * CHECK FOR USER IN DB (EMAIL)

  function checkIfUserExist() {
    user
      .findOne()
      .or([{ email: email }, { username: username }])
      .exec(function(err, result) {
        if (err) throw err;
        if (result === [] || result === null || result === undefined) {
          // * SAVE NEW USER
          var userInstance = new user({
            firstName: firstName.toLowerCase(),
            lastName: lastName.toLowerCase(),
            username: username,
            email: email,
            password: password,
            role: "user"
          });

          // * HASH PASSWORD AND SAVE PROFILE
          bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
              userInstance.password = hash;
              userInstance
                .save()
                .then(result => {
                  // console.log(result);
                  req.session.userId   = result._id;
                  req.session.role     = result.role;
                  req.session.userName = result.username;
                  return res.redirect("/");
                })
                .catch(function(err) {
                  // console.log(err);
                });
            });
          });
        } else {
          // console.log(result);
          let flashError = "";
          if (result.username === username) {
            flashError = "Username is already used.";
          }
          if (result.email === email) {
            flashError = "Email adress is already used.";
          }
          if (result.username === username && result.email === email) {
            flashError = "Username and email adress are already used.";
          }
          req.flash(
            "wrong signup",
            flashError + " Please try again with another one."
          );
          return res.redirect("/account/signup");
        }
      });
  }

  checkIfUserExist();
};

/*
.##........#######...######....#######..##.....##.########.....######...########.########
.##.......##.....##.##....##..##.....##.##.....##....##.......##....##..##..........##...
.##.......##.....##.##........##.....##.##.....##....##.......##........##..........##...
.##.......##.....##.##...####.##.....##.##.....##....##.......##...####.######......##...
.##.......##.....##.##....##..##.....##.##.....##....##.......##....##..##..........##...
.##.......##.....##.##....##..##.....##.##.....##....##.......##....##..##..........##...
.########..#######...######....#######...#######.....##........######...########....##...
*/

module.exports.logout = function(req, res, next) {

  console.log("logout (GET) :");

  req.session.destroy(err => {
    if (err) {
      return res.redirect("/");
    }
    res.clearCookie(SESS_NAME);
    res.redirect("/");
  });

};
