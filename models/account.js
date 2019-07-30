var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

/*
.##.....##..######..########.########.
.##.....##.##....##.##.......##.....##
.##.....##.##.......##.......##.....##
.##.....##..######..######...########.
.##.....##.......##.##.......##...##..
.##.....##.##....##.##.......##....##.
..#######...######..########.##.....##
*/

var userSchema = new Schema({
  firstName   : { type: String, required: true },
  lastName    : { type: String, required: true },
  username    : { type: String, required: true },
  email       : { type: String, required: true },
  password    : { type: String, required: true },
  role        : { type: String, default: "" },
  gender      : { type: String, default: "" },
  bio         : { type: String, default: "" },
  profilePic  : { type: String, default: "" },
  friends     :
  {
    confirmed :
    {
      type   : Array,
      default: []
    },
    pending :
    {
      type   : Array,
      default: []
    },
    rejected :
    {
      type   : Array,
      default: []
    },
    requested :
    {
      type   : Array,
      default: []
    },
    unaccepted :
    {
      type   : Array,
      default: []
    },
    accepted :
    {
      type   : Array,
      default: []
    }
  },
  creationDate : { type: Date, default: Date.now() }
});

module.exports.userSchema = userSchema;

/*
..######...#######..##.....##.##.....##.########.##....##.########
.##....##.##.....##.###...###.###...###.##.......###...##....##...
.##.......##.....##.####.####.####.####.##.......####..##....##...
.##.......##.....##.##.###.##.##.###.##.######...##.##.##....##...
.##.......##.....##.##.....##.##.....##.##.......##..####....##...
.##....##.##.....##.##.....##.##.....##.##.......##...###....##...
..######...#######..##.....##.##.....##.########.##....##....##...
*/

var commentSchema = new Schema({
  content :
    {
      type: String,
      default:""
    },
  creationDate:
    {
      type: Date,
      default: Date.now()
    },
  Owner:
    {
      type: String,
      default:""
    }
});

module.exports.commentSchema = commentSchema;

/*
.########...#######...######..########
.##.....##.##.....##.##....##....##...
.##.....##.##.....##.##..........##...
.########..##.....##..######.....##...
.##........##.....##.......##....##...
.##........##.....##.##....##....##...
.##.........#######...######.....##...
*/

var postSchema = new Schema({
  username :
    {
      type: String,
      required: true,
      default:""
    },
  content :
    {
      type: String,
      required: true,
      default:""
    },
  creationDate:
    {
      type: Date,
      default: Date.now()
    },
  comments:
    [
      commentSchema
    ]
});

module.exports.postSchema = postSchema;

/*
.########...#######...######..########.########.########.
.##.....##.##.....##.##....##....##....##.......##.....##
.##.....##.##.....##.##..........##....##.......##.....##
.########..##.....##..######.....##....######...########.
.##........##.....##.......##....##....##.......##...##..
.##........##.....##.##....##....##....##.......##....##.
.##.........#######...######.....##....########.##.....##
*/

var posterSchema = new Schema({
  ownerUserName   : { type: String, required: true },
  posts :
    [
      postSchema
    ]
});

module.exports.posterSchema = posterSchema;
