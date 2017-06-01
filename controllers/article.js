
var express = require('express');
var router = express.Router();
var Model = require('../models/article.js');
var journal = require('../models/journal.js');
var FB = require('fb');
const util = require('util');
var cron = require('node-cron');
var cheerio = require('cheerio');
var request = require('request');

FB.setAccessToken("EAADkzE276tgBAEztNmGynqGEpn4XWlbQelRkR9iOHYOpHoH80wLhG9mZAImoOcvNX5iAIIrImD1Y6vb29FkFVS1cgAw8ZANNhu01ThW1Jg2UCV28MZBJWlKr8MZBFsqtLir1VVQOZCkexWF2kccio8c575aZCs5rMZD");

function keyExists(key, search) {
    if (!search || (search.constructor !== Array && search.constructor !== Object)) {
        return false;
    }
    for (var i = 0; i < search.length; i++) {
        if (search[i] === key) {
            return true;
        }
    }
    return key in search;
}

module.exports= {
  getAndFindArticles: (request, response) => {
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


Model.find({}).sort({
    Likes: -1
}).skip(skip).limit(limit).populate({
        path: '_journal',
        model: 'Journal',
        select:'picture'

}).exec(function (err, resources) {

    if (err) {
        response.send(err).status(404);
    } else {
        response.send(resources).status(200);
    }

})
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
  getById: function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    Model.findById(req.params.id, function (err, article) {
      if (err)
        return next(err);
      console.log("hello article url" + article.Link);
      request( article.Link , function(error, response, html){
        if(!error){
          var $ = cheerio.load(html);
         // Tuniscope
        if (article.Link.split('.')[1] == "tuniscope")  {
          $('.text-justify').filter(function(){
             var data = $(this);
             text = data.children().nextAll('p').text().trim();
             article.FullDescription = text ;
          })
        }

        if (article.Link.split('.')[1] == "investir-en-tunisie")  {

          $('.entry-content').filter(function(){
          var data = $(this);
          text = data.text().trim();
          article.FullDescription = text ;
         })

        }

        if (article.Link.split('.')[1] == "kapitalis")  {
        $('.post_content').filter(function(){
        var data = $(this);
        text = data.children().nextAll('p').text().trim();
        article.FullDescription = text ;
        })
        }
        if (article.Link.split('.')[1] == "tunisie")  {
            $('.wiloke-content').filter(function(){
            var data = $(this);
            text = data.children().nextAll('p').text().trim();
            article.FullDescription = text ;
          })
        }

         // Mosaique
        if (article.Link.split('.')[1] == "mosaiquefm")  {
          article.FullDescription = ""
          $('div.desc p').each(function (i, arc) {
            article.FullDescription += $(this).text().trim() ;
            scrapped = true ;
          });
          res.json(article);
        }

        // webmanagercenter
        if (article.Link.split('.')[1] == "webmanagercenter") {
          article.FullDescription = ""
          $('div.td-post-content p').each(function(i,arc){
            article.FullDescription += $(arc).text();
            scrapped = true ;
          });
          res.json(article);
        }


      }
        res.json(article);
      });

  })},

  getSimilarArticle:function (req, res, next) {

      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', true);


          Model.findById(req.params.id, function (err, ar) {
              var T=[];
              var nb ;
              var d ;
              if (err)
                  return next(err);
              if (ar.name){
                  var a = ar.name ;
              Model.find({}).populate({
                  path: '_journal',
                  model: 'Journal',
                  select:'picture'

              }).exec(function (err, article) {
                  if (err)
                      return next(err);
                  if (article) {

                      article.forEach(function (j) {

                          nb++;
                          var b = j.name;
                          var chunks = a.split(" ");
                          var commonsFound = 0;
                          for (var i = 0; i < chunks.length; i++) {
                              if (b && (!(keyExists(chunks[i], ['et','ou','avec','و','عن','كل','ما','في','لم',':','!','على'])))) {
                                  if (b.indexOf(chunks[i]) != -1)
                                  {

                                      commonsFound++;

                                  }
                              }
                          }
                          if (i = chunks.length) {
                             if (commonsFound >0 ) {
                                 if(j._journal){

                                 T.push({"_id":j._id,"name":j.name,"commonsFound":commonsFound,
                                 "journalPicture":j._journal.picture,"ArticlePicture":j.Picture,"Description":j.Description
                             })}};
                             console.log(commonsFound + " common substrings found.");

                          }

                      });
                  }
                  if(nb= article.length){

                      //data = JSON.parse(JSON.stringify(T));
                      T.sort(function(a, b) {
                          return parseFloat(b.commonsFound) - parseFloat(a.commonsFound);
                      });
                      res.json(T.slice(1,4));


                  }


              })}


          });




  },

    getByDate: (request, response) => {
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


        Model.find({}).sort({
            Date: -1
        }).skip(skip).limit(limit).populate({
            path: '_journal',
            model: 'Journal',
            select:'picture'

        }).exec(function (err, resources) {

            if (err) {
                response.send(err).status(404);
            } else {
                response.send(resources).status(200);
            }

        })
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


    } ,
    listAll: function (req, res, next) {

        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);


        Model.find({}, function (err, article) {
            if (err)
                return next(err);
            res.json(article)
        });

    },




}
