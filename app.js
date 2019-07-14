'use strict';

// ###### #    # #####  #####  ######  ####   ####
// #       #  #  #    # #    # #      #      #
// #####    ##   #    # #    # #####   ####   ####
// #        ##   #####  #####  #           #      #
// #       #  #  #      #   #  #      #    # #    #
// ###### #    # #      #    # ######  ####   ####

const express    = require('express');
const app        = express();
const http       = require('http').Server(app);
const conf       = require('./secrets/conf.js');
const routes     = require('./routes');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const session    = require('express-session');
const MongoStore = require('connect-mongo')(session);
const pug        = require('pug');
const flash      = require('connect-flash');
const TWO_HOURS  = 3000 * 60 * 60 * 2;
const {
  PORT          = 8080,
  NODE_ENV      = 'development',
  SESS_NAME     = 'sid',
  SESS_SECRET   = conf.secret,
  SESS_LIFETIME = TWO_HOURS
  }             = process.env;
const IN_PROD = NODE_ENV === 'production';

// #    #  ####  #    #  ####   ####   ####   ####  ######
// ##  ## #    # ##   # #    # #    # #    # #      #
// # ## # #    # # #  # #      #    # #    #  ####  #####
// #    # #    # #  # # #  ### #    # #    #      # #
// #    # #    # #   ## #    # #    # #    # #    # #
// #    #  ####  #    #  ####   ####   ####   ####  ######

mongoose.connect(conf.mongoDB, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// ####  #####   ##   ##### #  ####
// #        #    #  #    #   # #    #
//  ####    #   #    #   #   # #
//      #   #   ######   #   # #
// #    #   #   #    #   #   # #    #
//  ####    #   #    #   #   #  ####

app.use('/www', express.static(__dirname + '/bin/www'));
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/semantic', express.static(__dirname + '/public/vendor/semantic/dist'));
app.use('/vendor', express.static(__dirname + '/public/vendor'));
app.set('view engine', 'pug');
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }))

// ####  ######  ####   ####  #  ####  #    #  ####
// #      #      #      #      # #    # ##   # #
//  ####  #####   ####   ####  # #    # # #  #  ####
//      # #           #      # # #    # #  # #      # 
// #    # #      #    # #    # # #    # #   ## #    #
//  ####  ######  ####   ####  #  ####  #    #  ####

app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: SESS_LIFETIME, // 2H
    sameSite: true,
    secure: IN_PROD
  },
  secret: SESS_SECRET,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));


// enregistrement du user dans une var

// app.use((req, res, next) => {
//   const { userId } = req.session;
//   if (userId) {
//     res.locals.user = users.find(
//       user => user.id === userID
//     )
//   }
//   next ()
// })

// appel

// const { user } = res.locals



// #####   ####  #    # ##### ######  ####
// #    # #    # #    #   #   #      #
// #    # #    # #    #   #   #####   ####
// #####  #    # #    #   #   #           #
// #   #  #    # #    #   #   #      #    #
// #    #  ####   ####    #   ######  ####`

app.use('/', routes);

// ###### #####  #####   ####  #####   ####
// #      #    # #    # #    # #    # #
// #####  #    # #    # #    # #    #  ####
// #      #####  #####  #    # #####       #
// #      #   #  #   #  #    # #   #  #    #
// ###### #    # #    #  ####  #    #  ####

app.use(function(req,res,next){
  if (res.statusCode == 503){
    res.send('Accès non autorisé')
  } else {
    res.status(404).send('Fichier non trouvé bobby');
  }
});

// #      #  ####  ##### ###### #    #
// #      # #        #   #      ##   #
// #      #  ####    #   #####  # #  #
// #      #      #   #   #      #  # #
// #      # #    #   #   #      #   ##
// ###### #  ####    #   ###### #    #

http.listen(PORT, function(){
  console.log(`App is up on ${PORT} !`);
});