module.exports.checkRole = function (req) {
  if (!req.session.role) {
    return "v";
  } else {
    if (req.session.role == "user") {
      return "u";
    } else {
      return "a";
    }
  }
};

module.exports.checkUserName = function (req) {
  if (!req.session.userName) {
    return false;
  } else {
    return req.session.userName;
  }
};