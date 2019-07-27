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
.########..########...#######..########.####.##.......########.....######...########.########
.##.....##.##.....##.##.....##.##........##..##.......##..........##....##..##..........##...
.##.....##.##.....##.##.....##.##........##..##.......##..........##........##..........##...
.########..########..##.....##.######....##..##.......######......##...####.######......##...
.##........##...##...##.....##.##........##..##.......##..........##....##..##..........##...
.##........##....##..##.....##.##........##..##.......##..........##....##..##..........##...
.##........##.....##..#######..##.......####.########.########.....######...########....##...
*/

module.exports.profilePage = function(req, res, next) {

  console.log("profilePage (GET) :");

    let searchedProfile = req.params.profile;
    let userName = functions.checkUserName(req);
    // console.log('userName is : ' + userName);
    // console.log('searchedProfile search is : ' + searchedProfile);

    let data                 = {};
        data.role            = functions.checkRole(req);
        data.userName        = userName;
        data.searchedProfile = searchedProfile;

    // * SEND DATA BASED ON USER PROFILE
    if (searchedProfile === userName) {
      data.isProfileOwner = true;
    } else {
      data.isProfileOwner = false;
    }

    // * FETCH REQUESTED PROFILE INFOS
    promise = functions.getUserData(searchedProfile)
    .then(async function (returned) {

      let searchedProfileResult;
      searchedProfileResult = returned[0];
      console.log(searchedProfileResult);

      // * FETCH REQUESTER PROFILE INFOS
      if (!data.isProfileOwner && data.role != 'v') {
        let userProfileResult = await functions.getUserData(userName);
        data.friendStatus = functions.checkIfSearchedProfileIsFriend(userProfileResult[0], searchedProfile);
      }

      let datePattern           = /(?:\bdigit-|\s|^)(\d{4})(?=[.?\s]|-digit\b|$)/g;
          data.bio              = searchedProfileResult.bio || '';
          data.joinedIn         = searchedProfileResult.creationDate.toString().match(datePattern)[0].trim() || '00/00/0000';
          data.friendsConfirmed = searchedProfileResult.friends.confirmed || [];
          data.friendsPending   = searchedProfileResult.friends.pending || [];
          data.friendsRejected  = searchedProfileResult.friends.rejected || [];
          data.friendsRequested = searchedProfileResult.friends.requested || [];
          data.friendsCount     = Object.keys(data.friendsConfirmed).length - 1 || 0;

      res.status(200).render("profile", {
        data: data
      });

    })
    .catch(function (err){
      console.log('dis errer is : ' + err);
      res.status(503);
      next();
    });

};

/*
....###..........##....###....##.....##.....######..########....###....########...######..##.....##.......###....##.......##..........##.....##..######..########.########...######.
...##.##.........##...##.##....##...##.....##....##.##.........##.##...##.....##.##....##.##.....##......##.##...##.......##..........##.....##.##....##.##.......##.....##.##....##
..##...##........##..##...##....##.##......##.......##........##...##..##.....##.##.......##.....##.....##...##..##.......##..........##.....##.##.......##.......##.....##.##......
.##.....##.......##.##.....##....###........######..######...##.....##.########..##.......#########....##.....##.##.......##..........##.....##..######..######...########...######.
.#########.##....##.#########...##.##............##.##.......#########.##...##...##.......##.....##....#########.##.......##..........##.....##.......##.##.......##...##.........##
.##.....##.##....##.##.....##..##...##.....##....##.##.......##.....##.##....##..##....##.##.....##....##.....##.##.......##..........##.....##.##....##.##.......##....##..##....##
.##.....##..######..##.....##.##.....##.....######..########.##.....##.##.....##..######..##.....##....##.....##.########.########.....#######...######..########.##.....##..######.
*/

module.exports.allUsers = function (req, res, next) {

  user
    .find()
    .select('username')
    .exec(function(err, result) {

      if (err) throw err;
      res.send(result);

    });

};

/*
.########..#######..##.......##........#######..##......##
.##.......##.....##.##.......##.......##.....##.##..##..##
.##.......##.....##.##.......##.......##.....##.##..##..##
.######...##.....##.##.......##.......##.....##.##..##..##
.##.......##.....##.##.......##.......##.....##.##..##..##
.##.......##.....##.##.......##.......##.....##.##..##..##
.##........#######..########.########..#######...###..###.
*/

module.exports.add_friend = function (req, res, next) {

  const { userToFollow } = req.body;
  const userFollowing = req.session.userName;

  function addFriend () {
    // * update user firends list
    const un = new Promise (function (resolve, reject) {
      functions.pushUpdateFriendArray(userFollowing, {'friends.requested': userToFollow});
      resolve(true);
    });
    // * update new friend own lists
    const deux = new Promise (function (resolve, reject) {
      functions.pushUpdateFriendArray(userToFollow, {'friends.pending': userFollowing});
      resolve(true);
    });

    Promise.all([un, deux]).then(function(values) {
      return res.send('Friend request sent');
    });
  }
  addFriend ();
};

/*
.##.....##.##....##.########..#######..##.......##........#######..##......##
.##.....##.###...##.##.......##.....##.##.......##.......##.....##.##..##..##
.##.....##.####..##.##.......##.....##.##.......##.......##.....##.##..##..##
.##.....##.##.##.##.######...##.....##.##.......##.......##.....##.##..##..##
.##.....##.##..####.##.......##.....##.##.......##.......##.....##.##..##..##
.##.....##.##...###.##.......##.....##.##.......##.......##.....##.##..##..##
..#######..##....##.##........#######..########.########..#######...###..###.
*/

module.exports.unfollow_friend = function (req, res, next) {

  const { userToUnFollow } = req.body;
  const userFollowing = req.session.userName;

  function unFollowFriend () {
    // * update user firends list
    const un = new Promise (function (resolve, reject) {
      functions.pullUpdateFriendArray(userFollowing, {'friends.requested': userToUnFollow});
      resolve(true);
    });
    // * update new friend own lists
    const deux = new Promise (function (resolve, reject) {
      functions.pullUpdateFriendArray(userToFollow, {'friends.pending': userFollowing});
      resolve(true);
    });

    Promise.all([un, deux]).then(function(values) {
      return res.send('Friend request sent');
    });
  }
  unFollowFriend ();
};

/*
....###....########..########..########...#######..##.....##.########
...##.##...##.....##.##.....##.##.....##.##.....##.##.....##.##......
..##...##..##.....##.##.....##.##.....##.##.....##.##.....##.##......
.##.....##.########..########..########..##.....##.##.....##.######..
.#########.##........##........##...##...##.....##..##...##..##......
.##.....##.##........##........##....##..##.....##...##.##...##......
.##.....##.##........##........##.....##..#######.....###....########
*/

module.exports.approve_friend = function (req, res, next) {

  const { userToApprove } = req.body;
  const userApproving = req.session.userName;

  console.log('to approve : ' + userToApprove);
  console.log('approver : ' + userApproving);

  function approveFriend () {
    // * update user firends list
    const un = new Promise (function (resolve, reject) {
      functions.pullUpdateFriendArray(userApproving, {'friends.pending': userToApprove});
      resolve(true);
    });
    const deux = new Promise (function (resolve, reject) {
      functions.pushUpdateFriendArray(userApproving, {'friends.confirmed': userToApprove});
      resolve(true);
    });

    // * update new friend own lists
    const trois = new Promise (function (resolve, reject) {
      functions.pullUpdateFriendArray(userToApprove, {'friends.requested': userApproving});
      resolve(true);
    });
    const quatre = new Promise (function (resolve, reject) {
      functions.pushUpdateFriendArray(userToApprove, {'friends.confirmed': userApproving});
      resolve(true);
    });

    Promise.all([un, deux, trois, quatre]).then(function(values) {
      return res.send('Friend added');
    });
  }
  approveFriend ();
};

/*
.########..########.##.....##..#######..##.....##.########....########.########..####.########.##....##.########.
.##.....##.##.......###...###.##.....##.##.....##.##..........##.......##.....##..##..##.......###...##.##.....##
.##.....##.##.......####.####.##.....##.##.....##.##..........##.......##.....##..##..##.......####..##.##.....##
.########..######...##.###.##.##.....##.##.....##.######......######...########...##..######...##.##.##.##.....##
.##...##...##.......##.....##.##.....##..##...##..##..........##.......##...##....##..##.......##..####.##.....##
.##....##..##.......##.....##.##.....##...##.##...##..........##.......##....##...##..##.......##...###.##.....##
.##.....##.########.##.....##..#######.....###....########....##.......##.....##.####.########.##....##.########.
*/

module.exports.remove_friend = function (req, res, next) {

  const { userToRemove } = req.body;
  const userRemoving = req.session.userName;

  console.log('to remove : ' + userToRemove);
  console.log('remover : ' + userRemoving);

  function removeFriend () {
    // * update user firends list
    const un = new Promise (function (resolve, reject) {
      functions.pullUpdateFriendArray(userRemoving, {'friends.confirmed': userToRemove});
      resolve(true);
    });
    // * update new friend own lists
    const deux = new Promise (function (resolve, reject) {
      functions.pullUpdateFriendArray(userToRemove, {'friends.confirmed': userRemoving});
      resolve(true);
    });

    Promise.all([un, deux]).then(function(values) {
      return res.send('Friend removed');
    });
  }
  removeFriend ();
};

/*
.########..########..######..##.......####.##....##.########....########.########..####.########.##....##.########.
.##.....##.##.......##....##.##........##..###...##.##..........##.......##.....##..##..##.......###...##.##.....##
.##.....##.##.......##.......##........##..####..##.##..........##.......##.....##..##..##.......####..##.##.....##
.##.....##.######...##.......##........##..##.##.##.######......######...########...##..######...##.##.##.##.....##
.##.....##.##.......##.......##........##..##..####.##..........##.......##...##....##..##.......##..####.##.....##
.##.....##.##.......##....##.##........##..##...###.##..........##.......##....##...##..##.......##...###.##.....##
.########..########..######..########.####.##....##.########....##.......##.....##.####.########.##....##.########.
*/

module.exports.decline_friend = function (req, res, next) {

  const { userToDecline } = req.body;
  const userDeclining = req.session.userName;

  console.log('to decline : ' + userToDecline);
  console.log('decliner : ' + userDeclining);

  function declineFriend () {
    // * update user firends list
    const un = new Promise (function (resolve, reject) {
      functions.pullUpdateFriendArray(userDeclining, {'friends.pending': userToDecline});
      resolve(true);
    });
    const deux = new Promise (function (resolve, reject) {
      functions.pushUpdateFriendArray(userDeclining, {'friends.rejected': userToDecline});
      resolve(true);
    });

    // * update new friend own lists
    const trois = new Promise (function (resolve, reject) {
      functions.pullUpdateFriendArray(userToDecline, {'friends.requested': userDeclining});
      resolve(true);
    });
    const quatre = new Promise (function (resolve, reject) {
      functions.pushUpdateFriendArray(userToDecline, {'friends.unaccepted': userDeclining});
      resolve(true);
    });

    Promise.all([un, deux, trois, quatre]).then(function(values) {
      return res.send('Friend blocked');
    });
  }
  declineFriend ();
};

/*
.##.....##.##....##.########..##........#######...######..##....##....########.########..####.########.##....##.########.
.##.....##.###...##.##.....##.##.......##.....##.##....##.##...##.....##.......##.....##..##..##.......###...##.##.....##
.##.....##.####..##.##.....##.##.......##.....##.##.......##..##......##.......##.....##..##..##.......####..##.##.....##
.##.....##.##.##.##.########..##.......##.....##.##.......#####.......######...########...##..######...##.##.##.##.....##
.##.....##.##..####.##.....##.##.......##.....##.##.......##..##......##.......##...##....##..##.......##..####.##.....##
.##.....##.##...###.##.....##.##.......##.....##.##....##.##...##.....##.......##....##...##..##.......##...###.##.....##
..#######..##....##.########..########..#######...######..##....##....##.......##.....##.####.########.##....##.########.
*/

module.exports.unblock_friend = function (req, res, next) {

  const { userToUnblock } = req.body;
  const userBlocking = req.session.userName;

  console.log('to decline : ' + userToUnblock);
  console.log('decliner : ' + userBlocking);

  function declineFriend () {
    // * update user firends list
    const un = new Promise (function (resolve, reject) {
      functions.pullUpdateFriendArray(userBlocking, {'friends.rejected': userToUnblock});
      resolve(true);
    });
    const deux = new Promise (function (resolve, reject) {
      functions.pushUpdateFriendArray(userBlocking, {'friends.confirmed': userToUnblock});
      resolve(true);
    });

    // * update new friend own lists
    const trois = new Promise (function (resolve, reject) {
      functions.pullUpdateFriendArray(userToUnblock, {'friends.unaccepted': userBlocking});
      resolve(true);
    });
    const quatre = new Promise (function (resolve, reject) {
      functions.pushUpdateFriendArray(userToUnblock, {'friends.confirmed': userBlocking});
      resolve(true);
    });

    Promise.all([un, deux, trois, quatre]).then(function(values) {
      return res.send('Friend blocked');
    });
  }
  declineFriend ();
};