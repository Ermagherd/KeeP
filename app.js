'use strict';
                                               
// ###### #    # #####  #####  ######  ####   ####  
// #       #  #  #    # #    # #      #      #      
// #####    ##   #    # #    # #####   ####   ####  
// #        ##   #####  #####  #           #      # 
// #       #  #  #      #   #  #      #    # #    # 
// ###### #    # #      #    # ######  ####   ####  


const express = require('express');
const app = express();
const http = require('http').Server(app);
const mongoose = require('mongoose');
const conf = require("./secrets/conf.js");
const session = require('express-session');

mongoose.connect(conf.mongo, {useNewUrlParser: true});
  
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
app.use('/vendor', express.static(__dirname + '/public/vendor'));
                                          
// #####   ####  #    # ##### ######  ####  
// #    # #    # #    #   #   #      #      
// #    # #    # #    #   #   #####   ####  
// #####  #    # #    #   #   #           # 
// #   #  #    # #    #   #   #      #    # 
// #    #  ####   ####    #   ######  ####  
                                         

app.get('/', function(req, res, next){
  res.send("we're in boys ");
})
                                           
// ###### #####  #####   ####  #####   ####  
// #      #    # #    # #    # #    # #      
// #####  #    # #    # #    # #    #  ####  
// #      #####  #####  #    # #####       # 
// #      #   #  #   #  #    # #   #  #    # 
// ###### #    # #    #  ####  #    #  ####  


app.use(function(req,res,next){
  // test l'entête de la réponse
  if (res.statusCode == 503){
    res.send('Accès non autorisé')
  } else {
    // si erreur par défaut : status passé à 404 avant d'envoyer la réponse
    res.status(404).send('Fichier non trouvé');
  }
});
                                     
// #      #  ####  ##### ###### #    # 
// #      # #        #   #      ##   # 
// #      #  ####    #   #####  # #  # 
// #      #      #   #   #      #  # # 
// #      # #    #   #   #      #   ## 
// ###### #  ####    #   ###### #    # 
                                    
http.listen(8080, function(){
  console.log(`A l'écoute sur 8080`);
})