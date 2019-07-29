const mongoose       = require("mongoose");
const accountSchemas = require('../models/account');
const user           = mongoose.model("user", accountSchemas.userSchema);
const poster         = mongoose.model("poster", accountSchemas.posterSchema);
const post           = mongoose.model("post", accountSchemas.postSchema);
const comment        = mongoose.model("comment", accountSchemas.commentSchema);

/*
..######..##.....##.########..######..##....##....########...#######..##.......########
.##....##.##.....##.##.......##....##.##...##.....##.....##.##.....##.##.......##......
.##.......##.....##.##.......##.......##..##......##.....##.##.....##.##.......##......
.##.......#########.######...##.......#####.......########..##.....##.##.......######..
.##.......##.....##.##.......##.......##..##......##...##...##.....##.##.......##......
.##....##.##.....##.##.......##....##.##...##.....##....##..##.....##.##.......##......
..######..##.....##.########..######..##....##....##.....##..#######..########.########
*/

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

/*
..######..##.....##.########..######..##....##....##.....##..######..########.########..##....##....###....##.....##.########
.##....##.##.....##.##.......##....##.##...##.....##.....##.##....##.##.......##.....##.###...##...##.##...###...###.##......
.##.......##.....##.##.......##.......##..##......##.....##.##.......##.......##.....##.####..##..##...##..####.####.##......
.##.......#########.######...##.......#####.......##.....##..######..######...########..##.##.##.##.....##.##.###.##.######..
.##.......##.....##.##.......##.......##..##......##.....##.......##.##.......##...##...##..####.#########.##.....##.##......
.##....##.##.....##.##.......##....##.##...##.....##.....##.##....##.##.......##....##..##...###.##.....##.##.....##.##......
..######..##.....##.########..######..##....##.....#######...######..########.##.....##.##....##.##.....##.##.....##.########
*/

module.exports.checkUserName = function (req) {
  if (!req.session.userName) {
    return false;
  } else {
    return req.session.userName;
  }
};

/*
.####..######.....########.########..####.########.##....##.########......#######.
..##..##....##....##.......##.....##..##..##.......###...##.##.....##....##.....##
..##..##..........##.......##.....##..##..##.......####..##.##.....##..........##.
..##...######.....######...########...##..######...##.##.##.##.....##........###..
..##........##....##.......##...##....##..##.......##..####.##.....##.......##....
..##..##....##....##.......##....##...##..##.......##...###.##.....##.............
.####..######.....##.......##.....##.####.########.##....##.########........##....
*/

module.exports.checkIfSearchedProfileIsFriend = function (result, searchedProfile) {
  let requested  = result.friends.requested || [];
  let unaccepted = result.friends.unaccepted || [];
  let confirmed  = result.friends.confirmed || [];
  if (requested !== undefined && requested.includes(searchedProfile)) return 'requested';
  if (unaccepted !== undefined && unaccepted.includes(searchedProfile)) return 'unaccepted';
  if (confirmed !== undefined && confirmed.includes(searchedProfile)) return 'confirmed';
  return false;
};

/*
..######...########.########....##.....##..######..########.########.....########.....###....########....###...
.##....##..##..........##.......##.....##.##....##.##.......##.....##....##.....##...##.##......##......##.##..
.##........##..........##.......##.....##.##.......##.......##.....##....##.....##..##...##.....##.....##...##.
.##...####.######......##.......##.....##..######..######...########.....##.....##.##.....##....##....##.....##
.##....##..##..........##.......##.....##.......##.##.......##...##......##.....##.#########....##....#########
.##....##..##..........##.......##.....##.##....##.##.......##....##.....##.....##.##.....##....##....##.....##
..######...########....##........#######...######..########.##.....##....########..##.....##....##....##.....##
*/

module.exports.getUserData = async function(searchedProfile) {

  let data = await user.find({username:searchedProfile});
  let messages = await post.find({username:searchedProfile}).sort({creationDate: -1});
  let userInfos = {
    data: data,
    messages: messages
  }
  return userInfos;

};

// module.exports.getUserData = async function(searchedProfile) {

//   var data = await user.find({username:searchedProfile});
//   return data;

// };

/*
.########..##.....##.##.......##..........########.########..####.########.##....##.########.
.##.....##.##.....##.##.......##..........##.......##.....##..##..##.......###...##.##.....##
.##.....##.##.....##.##.......##..........##.......##.....##..##..##.......####..##.##.....##
.########..##.....##.##.......##..........######...########...##..######...##.##.##.##.....##
.##........##.....##.##.......##..........##.......##...##....##..##.......##..####.##.....##
.##........##.....##.##.......##..........##.......##....##...##..##.......##...###.##.....##
.##.........#######..########.########....##.......##.....##.####.########.##....##.########.
*/

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

/*
.########..##.....##..######..##.....##....########.########..####.########.##....##.########.
.##.....##.##.....##.##....##.##.....##....##.......##.....##..##..##.......###...##.##.....##
.##.....##.##.....##.##.......##.....##....##.......##.....##..##..##.......####..##.##.....##
.########..##.....##..######..#########....######...########...##..######...##.##.##.##.....##
.##........##.....##.......##.##.....##....##.......##...##....##..##.......##..####.##.....##
.##........##.....##.##....##.##.....##....##.......##....##...##..##.......##...###.##.....##
.##.........#######...######..##.....##....##.......##.....##.####.########.##....##.########.
*/

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

/*
.########..##.....##..######..##.....##....########...#######...######..########
.##.....##.##.....##.##....##.##.....##....##.....##.##.....##.##....##....##...
.##.....##.##.....##.##.......##.....##....##.....##.##.....##.##..........##...
.########..##.....##..######..#########....########..##.....##..######.....##...
.##........##.....##.......##.##.....##....##........##.....##.......##....##...
.##........##.....##.##....##.##.....##....##........##.....##.##....##....##...
.##.........#######...######..##.....##....##.........#######...######.....##...
*/

// module.exports.pushPost = function(username, content, res) {

//   let postInstance = new post({
//     username: username,
//     content: content
//   });

//   postInstance
//   .save()
//   .then(result => {
//     console.log('then de postInstance')
//     console.log(result)
//     res.send(result);
//   })
//   .catch(err => {
//     console.log(err);
//   });

// };

/*
..######...#######..########..########....########...#######...######..########..######.
.##....##.##.....##.##.....##....##.......##.....##.##.....##.##....##....##....##....##
.##.......##.....##.##.....##....##.......##.....##.##.....##.##..........##....##......
..######..##.....##.########.....##.......########..##.....##..######.....##.....######.
.......##.##.....##.##...##......##.......##........##.....##.......##....##..........##
.##....##.##.....##.##....##.....##.......##........##.....##.##....##....##....##....##
..######...#######..##.....##....##.......##.........#######...######.....##.....######.
*/

// module.exports.preparePosts = function(postsList) {

//   let   messages    = postsList;
//   console.log(messages);

//   messages.forEach((element, index) => {

//     console.log(element.creationDate);
//     let newDateFormat = element.creationDate.toString().slice(4,15) || 'date unknown';
//     // console.log(newDateFormat);

//     let newElement = {
//       username    : element.username,
//       content     : element.content,
//       creationDate: newDateFormat,
//       comments    : element.comments,
//       _id         : element._id
//     };

//     messages[index] = newElement;
//   });

//   return messages;
// };


function preparePosts (postsList) {

  let   messages    = postsList;
  console.log(messages);

  messages.forEach((element, index) => {

    console.log(element.creationDate);
    let newDateFormat = element.creationDate.toString().slice(4,15) || 'date unknown';
    // console.log(newDateFormat);

    let newElement = {
      username    : element.username,
      content     : element.content,
      creationDate: newDateFormat,
      comments    : element.comments,
      _id         : element._id
    };

    messages[index] = newElement;
  });

  return messages;
}

module.exports.preparePosts = preparePosts;


module.exports.pushPost = function(username, content, res) {

  let postInstance = new post({
    username: username,
    content: content
  });

  postInstance
  .save()
  .then(result => {
    console.log('then de postInstance')
    console.log(result)
    let messageArray = [];
    messageArray.push(result);
    let messagePrep = preparePosts(messageArray);
    res.send(messagePrep);
  })
  .catch(err => {
    console.log(err);
  });

};