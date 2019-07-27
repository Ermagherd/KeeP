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
    console.log('userName is : ' + userName);
    console.log('searchedProfile search is : ' + searchedProfile);

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

      // * FETCH REQUESTER PROFILE INFOS
      if (!data.isProfileOwner) {
        let userProfileResult = await functions.getUserData(userName);
        data.friendStatus = functions.checkIfSearchedProfileIsFriend(userProfileResult[0], searchedProfile);
      }

      let datePattern           = /(?:\bdigit-|\s|^)(\d{4})(?=[.?\s]|-digit\b|$)/g;
          data.bio              = searchedProfileResult.bio;
          data.joinedIn         = searchedProfileResult.creationDate.toString().match(datePattern)[0].trim();
          data.friendsConfirmed = searchedProfileResult.friends.confirmed;
          data.friendsPending   = searchedProfileResult.friends.pending;
          data.friendsRejected  = searchedProfileResult.friends.rejected;
          data.friendsAccepted  = searchedProfileResult.friends.accepted;
          data.friendsCount     = Object.keys(data.friendsConfirmed).length + Object.keys(data.friendsAccepted).length - 2;

      // console.log(data);

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

module.exports.follow = function (req, res, next) {

  const { userToFollow } = req.body;
  const userFollowing = req.session.userName;

  user
    .updateOne(
      {username: userFollowing},
      { $push:
        {
          'friends.requested': userToFollow
        }
      },
      function(err, result) {

        if (err) throw err;

        user
          .updateOne(
            {username: userToFollow},
            { $push:
              {
                'friends.pending': userFollowing
              }
            },
            function(err, result) {

              if (err) throw err;

              console.log('seems ok');

              res.send();
            }
          );
      }
    );
};