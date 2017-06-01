/**
* Created by nour on 4/5/17.
*/
var express = require('express');
var categorie = require('../models/categorie.js');
var journal = require('../models/journal.js');
const util = require('util');



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

        categorie.findById(req.params.id, function (err, categorie) {
            if (err)
                return next(err);
            res.json(categorie)
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

        categorie.find({}, function (err, categorie) {
            if (err)
                return next(err);
            res.json(categorie)
        });

    },
    getArticle: function (request, response, next) {
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


        categorie.findById(request.params.id)
            .populate({
                path: '_journal',
                select: 'articles',
                populate: {
                    path: 'articles',
                    model: 'Article'
                }
            }).sort({
            Likes: -1
        }).exec(function (err, docs) {
            var n = docs._journal.length;
            var i = 0;
            var T = [];
            docs._journal.forEach(function (j) {
                j.articles.forEach(function (jj) {
                    T.push(jj);

                });
                i++;
            });
            if (i == n) {

                response.json(T.slice(skip, limit));

            }


        });
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


    getJournal: function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);
        categorie.findById(req.params.id).populate('_journal').slice('_journal', 10).exec(function (err, j) {
            res.json(j._journal);
        });
    },
    AddCategorie: function (req, res, next) {
        var name = req.body.name;


        var c = new categorie({
            name: name

        });
        categorie.create(c, function (err, post) {
            console.log(req.body);
            if (err) return next(err);
            res.json(post);
        });
    },
    deleteOne: function (req, res, next) {
        categorie.remove({_id: req.body.id}, function (err) {
            if (!err) {
                res.json({message: 'Deleted'})
                console.log('notification!');
            }
            else {
                res.json({message: 'ERROR'})
                console.log('error');
            }

        });


    }
}


