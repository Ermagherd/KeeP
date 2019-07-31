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
const user           = mongoose.model("user", accountSchemas.userSchema);
const poster         = mongoose.model("poster", accountSchemas.posterSchema);
const post           = mongoose.model("post", accountSchemas.postSchema);
const comment        = mongoose.model("comment", accountSchemas.commentSchema);

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

*/

module.exports.validateLogin = [
  check("username", "Votre pseudo est invalide. Veuillez réessayer.")
    .not()
    .isEmpty()
    .matches(/^[A-zÀ-ÖØ-öø-ÿ0-9]+$/, "i")
    .isLength({ min: 3, max: 20 })
    .trim()
    .escape(),
  check("password", "Votre mot de passe est invalide. Veuillez réessayer.")
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
  const { username, password } = req.body;
  let data = {};

  // * CHECK DATA VALIDITY AND REDIRECT IF FAILED

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let errorsMessages = "";
    errors.array().forEach(element => {
      errorsMessages += element.msg + ". ";
    });
    req.flash(
      "wrong login",
      "Une erreur s'est produite (" +
        errorsMessages +
        "). Veuillez réessayer."
    );
    return res.redirect("/account/login");
  }

  // * CHECK FOR USER IN DB (username)

  function verifyLogin() {
    user.findOne({ username: username }).exec(function(err, result) {
      if (err) throw err;
      if (result != null || result != undefined) {
        var accountPassword = result.password;
        var passwordTest    = bcrypt.compareSync(password, accountPassword);
        if (passwordTest) {
          req.session.userId   = result._id;
          req.session.role     = result.role;
          req.session.userName = result.username;
          return res.redirect("/");
        } else {
          req.flash("wrong login", "Votre mot de passe est invalide. Veuillez réessayer.");
          return res.redirect("/account/login");
        }
      } else {
        req.flash("wrong login", "L'utilisateur n'existe pas. Veuillez réessayer.");
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
  check("firstName", "Votre prénom est invalide. Veuillez réessayer.")
    .not()
    .isEmpty()
    .matches(/^[A-zÀ-ÖØ-öø-ÿ]+$/, "i")
    .isLength({ min: 1, max: 30 })
    .trim()
    .escape(),
  check("lastName", "Votre nom est invalide. Veuillez réessayer.")
    .not()
    .isEmpty()
    .matches(/^[A-zÀ-ÖØ-öø-ÿ]+$/, "i")
    .isLength({ min: 1, max: 30 })
    .trim()
    .escape(),
  check("username", "Votre pseudo est invalide. Veuillez réessayer.")
    .not()
    .isEmpty()
    .matches(/^[A-zÀ-ÖØ-öø-ÿ0-9]+$/, "i")
    .isLength({ min: 3, max: 20 })
    .trim()
    .escape(),
  check("email", "Votre email est invalide. Veuillez réessayer.")
    .isEmail()
    .normalizeEmail()
    .trim()
    .escape(),
  check("password", "Votre mot de passe est invalide. Veuillez réessayer.")
    .not()
    .isEmpty()
    .isLength({ min: 8, max: 50 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{7,}$/, "i")
    .trim()
    .escape(),
  check(
    "passwordConfirmation", "Votre confirmation de mot de passe est invalide. Veuillez réessayer.")
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

  if (!errors.isEmpty()) {
    let errorsMessages = "";
    errors.array().forEach(element => {
      errorsMessages += element.msg + ". ";
    });
    req.flash(
      "wrong signup",
      "Une erreu s'est produite (" +
        errorsMessages +
        "). Veuillez réessayer."
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
                  req.session.userId   = result._id;
                  req.session.role     = result.role;
                  req.session.userName = result.username;

                  // * CREATE POSTER PROFILE

                  poster
                    .findOne( { username: username } )
                    .exec(function(err, resultPoster) {
                      if (err) throw err;
                      if (resultPoster === [] || resultPoster === null || resultPoster === undefined) {
                        // * SAVE NEW USER
                        var posterInstance = new poster({
                          ownerUserName: username,
                        });

                        posterInstance
                          .save()
                          .then(resultPoster => {
                            console.log(resultPoster);
                            return res.redirect("/");
                          })
                          .catch(function(err) {
                            console.log(err);
                          });
                      }
                    });

                })
                .catch(function(err) {
                  console.log(err);
                });
            });
          });
        } else {
          let flashError = "";
          if (result.username === username) {
            flashError = "Ce pseudo est déjà utilisé.";
          }
          if (result.email === email) {
            flashError = "Cet email est déjà utilisé.";
          }
          if (result.username === username && result.email === email) {
            flashError = "Ce pseudo et cet email sont déjà utilisés.";
          }
          req.flash(
            "wrong signup",
            flashError + " Veuillez réessayer."
          );
          return res.redirect("/account/signup");
        }
      });
  }

  checkIfUserExist();
};

module.exports.validateResetPassword = [
  check("username", "Votre pseudo est invalide. Veuillez réessayer.")
    .not()
    .isEmpty()
    .matches(/^[A-zÀ-ÖØ-öø-ÿ0-9]+$/, "i")
    .isLength({ min: 3, max: 20 })
    .trim()
    .escape(),
  check("password", "Votre mot de passe est invalide. Veuillez réessayer.")
    .not()
    .isEmpty()
    .isLength({ min: 8, max: 50 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{7,}$/, "i")
    .trim()
    .escape()
];


/*
.########..########..######..########.########....########.....###.....######...######..##......##..#######..########..########.
.##.....##.##.......##....##.##..........##.......##.....##...##.##...##....##.##....##.##..##..##.##.....##.##.....##.##.....##
.##.....##.##.......##.......##..........##.......##.....##..##...##..##.......##.......##..##..##.##.....##.##.....##.##.....##
.########..######....######..######......##.......########..##.....##..######...######..##..##..##.##.....##.########..##.....##
.##...##...##.............##.##..........##.......##........#########.......##.......##.##..##..##.##.....##.##...##...##.....##
.##....##..##.......##....##.##..........##.......##........##.....##.##....##.##....##.##..##..##.##.....##.##....##..##.....##
.##.....##.########..######..########....##.......##........##.....##..######...######...###..###...#######..##.....##.########.
*/

module.exports.reset_password = function(req, res, next) {

  console.log("reset password (POST) :");
  const { username, password } = req.body;

  var role = functions.checkRole(req);

  if (role === 'a') {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let errorsMessages = "";
      errors.array().forEach(element => {
        errorsMessages += element.msg + ". ";
      });
      req.flash(
        "wrong login",
        "Une erreur s'est produite (" +
          errorsMessages +
          "). Veuillez réessayer."
      );
      return res.redirect("/dashboard");
    }

    function resetPassword () {

      // * HASH PASSWORD AND SAVE PROFILE
      bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {

          let query       = { username: username };
          let fieldUpdate = { password: hash };

          user
          .findOneAndUpdate(
            query,
            fieldUpdate,
            (err, result) => {
              if (err) res.send ('unable to update profile pic');
              res.redirect('/dashboard');
            });
        });
      });
    }

    resetPassword ();

  } else {

    res.redirect('/dashboard');

  }


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
