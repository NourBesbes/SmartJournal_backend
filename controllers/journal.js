/**
* Created by nour on 4/5/17.
*/
var express = require('express');
var Model = require('../models/article.js');
var journal = require('../models/journal.js');
var article = require('../models/article.js');
var categorie = require('../models/categorie.js');
const util = require('util');
var FB = require('fb');
FB.setAccessToken("EAADkzE276tgBAEztNmGynqGEpn4XWlbQelRkR9iOHYOpHoH80wLhG9mZAImoOcvNX5iAIIrImD1Y6vb29FkFVS1cgAw8ZANNhu01ThW1Jg2UCV28MZBJWlKr8MZBFsqtLir1VVQOZCkexWF2kccio8c575aZCs5rMZD");





module.exports= {

  getById: function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    journal.findById(req.params.id, function (err, journal) {
      if (err)
      return next(err);
      res.json(journal)
    });
  },

  listAll: function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);


    journal.find({}, function (err, journal) {
      if (err)
      return next(err);
      res.json(journal)
    });

  },

  getArticles: function (request, response, next) {
      var limit = request.query.limit ? parseInt(request.query.limit) : 10
      var skip = request.query.skip ? parseInt(request.query.skip) : 0
      // Website you wish to allow to connect
      response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
// Request methods you wish to allow
      response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

// Request headers you wish to allow
      response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
// Set to true if you need the website to include cookies in the requests sent
// to the API (e.g. in case you use sessions)
      response.setHeader('Access-Control-Allow-Credentials', true);

    journal.findById(request.params.id).sort({
        Likes: -1
    }).populate('articles').exec(function(err, articles) { response.json(articles.articles.slice(skip,limit));});

      var limit = request.query.limit ? parseInt(request.query.limit) : 10
      var skip = request.query.skip ? parseInt(request.query.skip) : 0
      // Website you wish to allow to connect
      response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
      // Request methods you wish to allow
      response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

      // Request headers you wish to allow
      response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      response.setHeader('Access-Control-Allow-Credentials', true);



  },

  AddJournal: function(req,res,next){
    var picture_url ;
    var name = req.body.lienFb.split("/")[3] ;
      FB.api(`${name}?fields=picture`, function (response) {
          picture_url = response.picture.data.url;
          categorie.findOne({name:req.body.categorie }, function (err, c) {
              if (err)
                  return next(err);


      var j=new journal({
          lienFb : req.body.lienFb.split("/")[3],
          picture: picture_url,
          _categorie:c

      });
           journal.create(j, function (err, post) {
             console.log(req.body);
               if (err) return next(err);
               res.json(post);
           });
      });
      });
  }


}
