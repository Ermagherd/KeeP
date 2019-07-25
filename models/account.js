var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var userSchema = new Schema({
  firstName   : { type: String, required: true },
  lastName    : { type: String, required: true },
  username    : { type: String, required: true },
  email       : { type: String, required: true },
  password    : { type: String, required: true },
  role        : { type: String, default: "" },
  gender      : { type: String, default: "" },
  bio         : { type: String, default: "" },
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
    }
  },
  creationDate : { type: Date, default: Date.now() }
});

module.exports.userSchema = userSchema;

var postSchema = new Schema({
  ownerUserName   : { type: String, required: true },
  posts : { nested :
    {
      post :
      {
        type: String,
        default:""
      }
    }
  },
  creationDate: { type: Date, default: Date.now() }
});

module.exports.postSchema = postSchema;