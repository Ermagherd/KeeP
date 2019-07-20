var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var userSchema = new Schema({
  firstName   : { type: String, required: true },
  lastName    : { type: String, required: true },
  username    : { type: String, required: true },
  email       : { type: String, required: true },
  password    : { type: String, required: true },
  role        : { type: String, required: true },
  creationDate: { type: Date, default: Date.now() }
});

module.exports.userSchema = userSchema;