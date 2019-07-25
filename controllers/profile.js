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

    console.log('username search is : ' + searchedProfile);

    let data                 = {};
        data.role            = functions.checkRole(req);
        data.userName        = functions.checkUserName(req);
        data.searchedProfile = searchedProfile;


    // * FETCH REQUESTED PROFILE INFOS
    user
    .findOne({ username: searchedProfile })
    .exec(function(err, searchedProfileResult) {

      if (err) throw err;

      if (searchedProfileResult == null || searchedProfileResult == undefined) {

        next();

      } else {

        // * FETCH REQUESTER PROFILE INFOS
        

        // * SEND DATA BASED ON USER PROFILE
        if (searchedProfile === req.session.userName) {
          data.isProfileOwner = true;
        } else {
          data.isProfileOwner = false;

          // TODO CHECK USER FRIENDS ONLY IF NEEDED
          // TODO CHECK USER FRIENDS ONLY IF NEEDED
          // TODO CHECK USER FRIENDS ONLY IF NEEDED
          // TODO CHECK USER FRIENDS ONLY IF NEEDED
          // TODO CHECK USER FRIENDS ONLY IF NEEDED
          
          // user
          // .findOne({ username: data.userName })
          // .exec(function(err, userProfileResult) {

          //   data.isFriend = functions.checkIfSearchedProfileIsFriend(result, searchedProfile);


            
          // });

        }

        console.log(data.isFriend);


            data.bio      = searchedProfileResult.bio;
        let datePattern   = /(?:\bdigit-|\s|^)(\d{4})(?=[.?\s]|-digit\b|$)/g;
            data.joinedIn = searchedProfileResult.creationDate.toString().match(datePattern)[0].trim();
            data.friends  = searchedProfileResult.friends.confirmed;
            data.friendsPending = searchedProfileResult.friends.confirmed;
            data.friendsPending = searchedProfileResult.friends.pending;

        res.status(200).render("profile", {
          data: data
        });
      }
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

  console.log('all users are requested')

  user
    .find()
    .select('username')
    .exec(function(err, result) {

      if (err) throw err;

      console.log("retour de query : " + result);
      console.log('all users are sent');
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