

var Model = require('../models/article.js');
var journal = require('../models/journal.js');
var journalController = require('../controllers/journal.js');
var FB = require('fb');
const util = require('util');
var cron = require('node-cron');
var schedule = require('node-schedule');

FB.setAccessToken("EAADkzE276tgBAEztNmGynqGEpn4XWlbQelRkR9iOHYOpHoH80wLhG9mZAImoOcvNX5iAIIrImD1Y6vb29FkFVS1cgAw8ZANNhu01ThW1Jg2UCV28MZBJWlKr8MZBFsqtLir1VVQOZCkexWF2kccio8c575aZCs5rMZD");
var id='' ;
var cronjob = function() {
    console.log("hello from cron");
    schedule.scheduleJob('*/20 * * * *', function () {
        console.log('running a task 20 minutes');
        journal.find({}, function (err, res) {
            
            res.forEach(function(j){
                var lien = j.lienFb;

                FB.api(`${lien}/posts?fields=likes.summary(true),description,full_picture,link,name,id,created_time`, function (response) {

                    if (response.data) {

                    for (var i = 0; i < response.data.length; i++) {
                        if (response['data'][i]['description'] && response['data'][i]['full_picture']
                            &&response['data'][i]['name']&&response['data'][i]['link']
                        &&response['data'][i]['id']&&response['data'][i]['created_time']) {



                            Model.findOneAndUpdate(
                                {name: response['data'][i]['name']},
                                {
                                    $set: {

                                        name: response['data'][i]['name'],
                                        Description: response['data'][i]['description'],
                                        Picture: response['data'][i]['full_picture'],
                                        Link: response['data'][i]['link'],
                                        ArticleId: response['data'][i]['id'],
                                        Date: response['data'][i]['created_time'],
                                        Likes: util.inspect(response['data'][i]['likes']['summary']['total_count'], {
                                            showHidden: true,
                                            depth: null
                                        }),
                                        _journal: j._id

                                    }
                                },

                                {new: true, upsert: true}, function (err, doc) {

                                    journal.findByIdAndUpdate(j._id, {$addToSet: {articles: doc}}, function (err, journal) {
                                        if (err)
                                            return next(err);

                                    });

                                }
                            );


                        }
                    }} });


            })
        });
    });
}

module.exports = cronjob ;
