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

  if (!req.session.userId) {
    return res.redirect("/account/login");
  } else {

    let searchedProfile = req.params.profile;

    console.log('username search is : ' + searchedProfile);

    let data                 = {};
        data.role            = functions.checkRole(req);
        data.userName        = functions.checkUserName(req);
        data.searchedProfile = searchedProfile;

    // TODO CREATE SEPARATE ROUTES FOR VISITORS AND OWNER OF THE PROFILE
    // TODO ===> ONLY PUT A BOOL [isProfileOwner] DANS DATA ET TRIER LES INFOS DANS LE PUG???

    if (searchedProfile === req.session.userName) {

      // * IF USER IS OWNER OF PROFILE

      user
      .findOne({ username: searchedProfile })
      .exec(function(err, result) {

        if (err) throw err;
            data.bio      = result.bio;
        let datePattern   = /(?:\bdigit-|\s|^)(\d{4})(?=[.?\s]|-digit\b|$)/g;
            data.joinedIn = result.creationDate.toString().match(datePattern)[0].trim();
        
        console.log(data.joinedIn);

        res.status(200).render("profile", {
          data: data
        });

      });

    } else {

      // * IF USER IS NOT OWNER OF PROFILE

      res.status(200).render("profile", {
        data: data
      });

    }
  }
};
