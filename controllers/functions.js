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
  let requested  = result.friends.requested || [];
  let unaccepted = result.friends.unaccepted || [];
  let confirmed  = result.friends.confirmed || [];
  if (requested !== undefined && requested.includes(searchedProfile)) return 'requested';
  if (unaccepted !== undefined && unaccepted.includes(searchedProfile)) return 'unaccepted';
  if (confirmed !== undefined && confirmed.includes(searchedProfile)) return 'confirmed';
  return false;
};

module.exports.getUserData = async function(searchedProfile) {

  var data = await user.find({username:searchedProfile});
  return data;

};

module.exports.pullUpdateFriendArray = function(searchedProfile, pattern) {

  user
  .updateOne(
    {username: searchedProfile},
    { $pull:
      pattern
    }
  ).exec(function (){
    console.log('pull de ' + searchedProfile);
  });
};

module.exports.pushUpdateFriendArray = function(searchedProfile, pattern) {

  user
  .updateOne(
    {username: searchedProfile},
    { $push:
      pattern
    }
  ).
  exec(function (){
    console.log('push de ' + searchedProfile);
  });
};