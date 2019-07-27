const mongoose       = require("mongoose");
const accountSchemas = require('../models/account');
const user           = mongoose.model("user", accountSchemas.userSchema);

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

module.exports.checkIfSearchedProfileIsFriend = function (result, searchedProfile) {
  let requested  = result.friends.requested;
  let unaccepted = result.friends.unaccepted;
  let accepted   = result.friends.accepted;
  if (requested !== undefined && requested.includes(searchedProfile)) return 'requested';
  if (unaccepted !== undefined && unaccepted.includes(searchedProfile)) return 'unaccepted';
  if (accepted !== undefined && accepted.includes(searchedProfile)) return 'accepted';
  return false;
};

module.exports.getUserData = async function(searchedProfile) {

  var data = await user.find({username:searchedProfile});
  return data;

};