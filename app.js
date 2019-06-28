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
const PORT       = process.env.PORT || 8080;
const conf       = require("./secrets/conf.js");
const routes     = require('./routes');
const mongoose   = require('mongoose');
const session    = require('express-session');
const MongoStore = require('connect-mongo')(session);
const pug        = require('pug');

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

app.use(session({
  secret: conf.secret,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// #####   ####  #    # ##### ######  ####
// #    # #    # #    #   #   #      #
// #    # #    # #    #   #   #####   ####
// #####  #    # #    #   #   #           #
// #   #  #    # #    #   #   #      #    #
// #    #  ####   ####    #   ######  ####

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
})