//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var SomeModelSchema = new Schema({
  a_string          : String,
  a_date            : Date,
});

//Export function to create "SomeModel" model class
module.exports = mongoose.model('SomeModel', SomeModelSchema );

/* to use

//Create a SomeModel model just by requiring the module
var SomeModel = require('../models/somemodel')

// Use the SomeModel object (model) to find all SomeModel records
SomeModel.find(callback_function);

*/

// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// var SomeModelSchema = new Schema(
//   {
//     name: String,
//     binary: Buffer,
//     living: Boolean,
//     updated: { type: Date, default: Date.now() },
//     age: { type: Number, min: 18, max: 65, required: true },
//     mixed: Schema.Types.Mixed,
//     _someId: Schema.Types.ObjectId,
//     array: [],
//     ofString: [String], // You can also have an array of each of the other types too.
//     nested: { stuff: { type: String, lowercase: true, trim: true } }
//   });