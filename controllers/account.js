// VALIDATOR
const { check, body, validationResult } = require('express-validator');

// MONGOOSE
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    creationDate : { type: Date, default: Date.now() }
  });


// BCRYPT
const bcrypt = require('bcrypt');
const saltRounds = 10;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';

// TESTING //
// TESTING //

// const users = [
//   {id: 1, name: 'Alex', email: 'alex@gmail.com', password: 'secret1'},
//   {id: 2, name: 'Julie', email: 'julie@gmail.com', password: 'secret2'},
//   {id: 3, name: 'David', email: 'david@gmail.com', password: 'secret3'}
// ];

// TESTING //
// TESTING //

// LOGIN GET
module.exports.loginPage = function (req, res, next) {

  console.log('loginPage (GET) :');

  let data = {

  };
  res
  .status(200)
  .render('loginPage', {
    data: data
  });
};

// LOGIN POST
module.exports.userLogin = function (req, res, next) {

  console.log('userLogin (POST) :');

  const { email, password } = req.body;

  if (email && password) {
    const user = users.find(
      user => user.email === email && user.password === password
    )
    if (user) {
      req.session.userId = user.id;
      return res.redirect('/');
    }
  }

  let data = {

  };
  res
  .status(200)
  .render('userLogin', {
    data: data
  });
};

//SIGN IN GET
module.exports.signupPage = function (req, res, next) {

  console.log('signupPage (GET) :');

  let data = {

  };
  res
  .status(200)
  .render('signupPage', {
    data: data
  });
};

// SIGN IN VALIDATOR
module.exports.validateUserCreation = [
  check('firstName', 'firstName doesn\'t match requirements')
    .not().isEmpty()
    .isAlpha()
    .trim()
    .escape(),
  check('lastName', 'firstName doesn\'t match requirements')
    .not().isEmpty()
    .isAlpha()
    .trim()
    .escape(),
  check('username', 'username doesn\'t match requirements')
    .not().isEmpty()
    .isAlphanumeric()
    .isLength({min:3, max: 20})
    .trim()
    .escape(),
  check('email', 'email doesn\'t match requirements')
    .isEmail()
    .normalizeEmail()
    .trim()
    .escape(),
  check('password', 'Password doesn\'t match requirements')
    .not().isEmpty()
    .isLength({min:8, max: 50})
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{7,}$/, "i")
    .trim()
    .escape(),
  check('passwordConfirmation', 'Password Confirmation doesn\'t match requirements')
    .not().isEmpty()
    .isLength({min:8, max: 50})
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{7,}$/, "i")
    .trim()
    .escape(),
];

// SIGN IN POST
module.exports.createUser = function (req, res, next) {

  console.log('createUser (POST) :');
  const { firstName, lastName, username, email, password } = req.body;

  //TODO handling registration errors with messages.
  //
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {

    return res.redirect('/account/login');
    // return res.status(422).json({ errors: errors.array() });
    // return res.redirect('/login');

  }
  // next();


  //TODO check for existing user in db
  // if (exists) {

    //TODO if user exist => error and login

  // } else {

    //TODO if user doesn't exist => create and display confirmation

  var user = mongoose.model('user', userSchema );

  var userInstance = new user ({
    firstName: firstName,
    lastName: lastName,
    username: username,
    email: email,
    password: password,
  });

  /**
   * HASH PASSWORD AND SAVE PROFILE
   */
  // bcrypt.genSalt(saltRounds, function(err, salt) {
  //   bcrypt.hash(password, salt, function(err, hash) {
    
  //     userInstance.password = hash;

  //     userInstance
  //       .save()
  //       .then(result => {
  //         console.log(result);
  //       })
  //       // .catch(err => console.log(err));
  //       .catch(function (err) {
  //         console.log(err);
  //       });

  //   });
  // });

  /**
   * COMPARE DB PROFILE PASSWORD WITH QUERY
   */
  user.
    find().
    where('firstName').equals('Pierre').
    // where('age').gt(17).lt(50).  //Additional where query
    // limit(5).
    // sort({ age: -1 }).
    // select('name age').
    exec(
      function (err, result) {
        let test = bcrypt.compareSync(password, result[0].password); // true
        console.log(test);
      }
    );
  // req.session.userId = user.id  // SI BESOIN
  // return res.redirect('/')  // SI BESOIN

    let data = {
      username: username
    };

    res
    .status(200)
    .render('createUser', {
      data: data
    });

  // };

};

// LOGOUT GET
module.exports.logout = function (req, res, next) {

  console.log('logout (GET) :');

  req.session.destroy(err => {
    if (err) {
      return res.redirect('/')
    }

    res.clearCookie(SESS_NAME);
    res.redirect('/account/login');

  })

  let data = {

  };
  res
  .status(200)
  .render('logout', {
    data: data
  });
};
