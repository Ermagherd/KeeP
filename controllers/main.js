var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SomeModelSchema = new Schema(
  {
    name: String,
    // binary: Buffer,
    living: Boolean,
    // updated: { type: Date, default: Date.now() },
    age: { type: Number, min: 18, max: 65, required: true },
    // mixed: Schema.Types.Mixed,
    // _someId: Schema.Types.ObjectId,
    // array: [],
    // ofString: [String], // You can also have an array of each of the other types too.
    // nested: { stuff: { type: String, lowercase: true, trim: true } }
  });

var SomeModel = mongoose.model('SomeModel', SomeModelSchema );

var awesome_instance = new SomeModel({
  name: 'awesome',
  living: false,
  age: 43
 });

// awesome_instance.save(function (err) {
//   if (err) return handleError(err);
//   // saved!
// })

var secondModelSchema = new Schema(
  {
    model: String,
    annee: String
  }
)

var SecondModel = mongoose.model('TestModel', secondModelSchema)

var awesome_second_instance = new SecondModel({
  model: 'Bobby',
 });

// awesome_second_instance.save(function (err) {
//   if (err) return handleError(err);
//   // saved!
// })


module.exports.landingPage = function (req, res, next) {

  var users = mongoose.model('TestModel', secondModelSchema);

  // find all athletes who play tennis, selecting the 'name' and 'age' fields
  users.
  find().
  where('annee').equals('1984').
  // where('age').gt(17).lt(50).  //Additional where query
  // limit(5).
  // sort({ age: -1 }).
  // select('name age').
  exec(
    function (err, result) {
      var data = {
        test: result[0].model
      };
    
      res
      .status(200)
      .render('index', {
        test: data.test
      });
      // .send("This is our home page from controller");
    }
  );


  
};

module.exports.dashboardPage = function (req, res, next) {
    res
    .status(200)
    .send("This is the dashboard page from controller");
};