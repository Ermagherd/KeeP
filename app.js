"use strict";

/*
.########.##.....##.########..########..########..######...######.
.##........##...##..##.....##.##.....##.##.......##....##.##....##
.##.........##.##...##.....##.##.....##.##.......##.......##......
.######......###....########..########..######....######...######.
.##.........##.##...##........##...##...##.............##.......##
.##........##...##..##........##....##..##.......##....##.##....##
.########.##.....##.##........##.....##.########..######...######.
*/

const express    = require("express");
const app        = express();
const http       = require("http").Server(app);

const functions  = require('./controllers/functions');
const routes     = require("./routes");

const bodyParser = require("body-parser");
const mongoose   = require("mongoose");
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);
const pug        = require("pug");
const flash      = require("connect-flash");

const TWO_HOURS  = 3000 * 60 * 60 * 2;
const {
  PORT,
  DB_CONN,
  NODE_ENV,
  SESS_NAME,
  SESS_SECRET,
  SESS_LIFETIME = TWO_HOURS
  }             = process.env;
const IN_PROD = NODE_ENV === "production";

const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

/*
.##.....##..#######..##....##..######....#######...#######...######..########
.###...###.##.....##.###...##.##....##..##.....##.##.....##.##....##.##......
.####.####.##.....##.####..##.##........##.....##.##.....##.##.......##......
.##.###.##.##.....##.##.##.##.##...####.##.....##.##.....##..######..######..
.##.....##.##.....##.##..####.##....##..##.....##.##.....##.......##.##......
.##.....##.##.....##.##...###.##....##..##.....##.##.....##.##....##.##......
.##.....##..#######..##....##..######....#######...#######...######..########
*/

mongoose.connect(DB_CONN, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

/*
..######..########....###....########.####..######.
.##....##....##......##.##......##.....##..##....##
.##..........##.....##...##.....##.....##..##......
..######.....##....##.....##....##.....##..##......
.......##....##....#########....##.....##..##......
.##....##....##....##.....##....##.....##..##....##
..######.....##....##.....##....##....####..######.
*/

app.use("/www", express.static(__dirname + "/bin/www"));
app.use("/img", express.static(__dirname + "/public/img"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/semantic",express.static(__dirname + "/public/vendor/semantic/dist"));
app.use("/vendor", express.static(__dirname + "/public/vendor"));
app.set("view engine", "pug");
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'))
app.set('trust proxy', true);

/*
..######..########..######...######..####..#######..##....##..######.
.##....##.##.......##....##.##....##..##..##.....##.###...##.##....##
.##.......##.......##.......##........##..##.....##.####..##.##......
..######..######....######...######...##..##.....##.##.##.##..######.
.......##.##.............##.......##..##..##.....##.##..####.......##
.##....##.##.......##....##.##....##..##..##.....##.##...###.##....##
..######..########..######...######..####..#######..##....##..######.
*/

app.use(
  session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: SESS_LIFETIME, // 2H
      sameSite: true,
      secure: IN_PROD
    },
    secret: SESS_SECRET,
    proxy: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

/*
.########...#######..##.....##.########.########..######.
.##.....##.##.....##.##.....##....##....##.......##....##
.##.....##.##.....##.##.....##....##....##.......##......
.########..##.....##.##.....##....##....######....######.
.##...##...##.....##.##.....##....##....##.............##
.##....##..##.....##.##.....##....##....##.......##....##
.##.....##..#######...#######.....##....########..######.
*/

app.use("/", routes);

/*
.########.########..########...#######..########...######.
.##.......##.....##.##.....##.##.....##.##.....##.##....##
.##.......##.....##.##.....##.##.....##.##.....##.##......
.######...########..########..##.....##.########...######.
.##.......##...##...##...##...##.....##.##...##.........##
.##.......##....##..##....##..##.....##.##....##..##....##
.########.##.....##.##.....##..#######..##.....##..######.
*/

app.use(function(req, res, next) {
  let data = {};
  data.role            = functions.checkRole(req);
  data.userName        = functions.checkUserName(req);
  if (res.statusCode == 503) {
    res.status(503).render("503", {data: data});
  } else {
    res.status(404).render("404", {data: data});
  }
});

/*
.##.......####..######..########.########.##....##
.##........##..##....##....##....##.......###...##
.##........##..##..........##....##.......####..##
.##........##...######.....##....######...##.##.##
.##........##........##....##....##.......##..####
.##........##..##....##....##....##.......##...###
.########.####..######.....##....########.##....##
*/

http.listen(PORT, function() {
  console.log(`App is up on ${PORT} !`);
});
