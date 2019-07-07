// LOGIN
// TESTING //
// TESTING //

const users = [
  {id: 1, name: 'Alex', email: 'alex@gmail.com', password: 'secret1'},
  {id: 2, name: 'Julie', email: 'julie@gmail.com', password: 'secret2'},
  {id: 3, name: 'David', email: 'david@gmail.com', password: 'secret3'}
];

// TESTING //
// TESTING //

module.exports.loginPage = function (req, res, next) {
  let data = {

  };
  res
  .status(200)
  .render('loginPage', {
    data: data
  });
};

module.exports.userLogin = function (req, res, next) {

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

//SIGN IN
module.exports.signupPage = function (req, res, next) {
  let data = {

  };
  res
  .status(200)
  .render('signupPage', {
    data: data
  });
};

module.exports.createUser = function (req, res, next) {

  const { firstName, lastName, username, email, password } = req.body;

  if ( firstName && lastName && username && email && password ) {
    const exists = ''; // DB CHECK!!  
  }

  if (!exists) {
    // écriture en DB
  }

  // req.session.userId = user.id  // SI BESOIN

  // return res.redirect('/')  // SI BESOIN

  let data = {

  };
  res
  .status(200)
  .render('createUser', {
    data: data
  });
};

// LOGOUT
module.exports.logout = function (req, res, next) {

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
