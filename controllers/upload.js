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
const mongoose       = require("mongoose");
const accountSchemas = require('../models/account');
const user           = mongoose.model("user", accountSchemas.userSchema);
const poster         = mongoose.model("poster", accountSchemas.posterSchema);
const post           = mongoose.model("post", accountSchemas.postSchema);
const comment        = mongoose.model("comment", accountSchemas.commentSchema);


/*
.########.####.##.......########..######.....##.....##.########..##........#######.....###....########.
.##........##..##.......##.......##....##....##.....##.##.....##.##.......##.....##...##.##...##.....##
.##........##..##.......##.......##..........##.....##.##.....##.##.......##.....##..##...##..##.....##
.######....##..##.......######....######.....##.....##.########..##.......##.....##.##.....##.##.....##
.##........##..##.......##.............##....##.....##.##........##.......##.....##.#########.##.....##
.##........##..##.......##.......##....##....##.....##.##........##.......##.....##.##.....##.##.....##
.##.......####.########.########..######......#######..##........########..#######..##.....##.########.
*/

const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const { DB_CONN } = process.env;
var conn = mongoose.connection;

let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
})

// Storage Engine

const storage = new GridFsStorage({
  url: DB_CONN,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

module.exports.get_image = function(req, res, next) {

  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {

    // check if file
    if (!file || file.lenght === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    if(file.contentType === 'image/jpeg' || file.contentType === 'image/png') {

      // readstream
      const readstream = gfs.createReadStream(file.filename);

      readstream.pipe(res);

    } else {
      res.status(404).json({
        err: 'not an image'
      });
    }

  });


};