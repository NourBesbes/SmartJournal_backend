const express = require('express')
const router = express.Router()
const article=require('../controllers/article')
const journal=require('../controllers/journal')
const categorie=require('../controllers/categorie')
const Model=require('../models/article.js')
var textSearch = require('mongoose-text-search');



/*Model.createMapping(function(err,mapping){

    if(err){
        console.log("error creating mapping");
        console.log(err);
    }
    else{
        console.log("Mapping created");
        console.log(mapping);
    }

});
var stream = Model.synchronize();
var count=0;
stream.on('data',function () {
    count++;
});
stream.on('close',function () {
console.log("Indexed"+count+"documents");
});
stream.on('error',function () {
console.log(error);
});*/

router.post('/search',function (req,res,next) {
    res.redirect('/search?q=' +req.body.q);

});

router.get('/search',function (req,res,next) {
   /* Model.find(
        { "name": { "$regex": req.query.q, "$options": "i" } },
        function(err,docs) {
            var inspect = require('util').inspect;
            console.log(inspect(docs, {depth: null}));
            res.json(docs);
        }
    );*/
    Model.find({ $text : { $search : req.query.q } }, function (err, article) {
        res.json(article)
    })

        /* if(req.query.q){
         Model.search({
         query_string:{query:req.query.q}
         },function (err,results) {
         results :
         if(err)return next(err);
         var data=results.hits.hits.map(function (hit) {

         return(hit);


         });
         res.json(data);

         });
         }*/

});



    router.get('/article', article.getAndFindArticles);
    router.get('/articleByDate', article.getByDate);
    router.get('/journal', journal.listAll);
    router.get('/articles', article.listAll);

    router.get('/categorie', categorie.listAll);

    router.route('/journal/:id')
        .get(journal.getById)
    router.route('/journal/:id/article')
        .get(journal.getArticles)

    router.route('/article/:id')
        .get(article.getById)
    router.route('/SimilarArticle/:id')
        .get(article.getSimilarArticle)

    router.delete('/journal/:id', journal.deleteOne)

    router.delete('/categorie/:id', categorie.deleteOne)
    /*router.route('/categorie/:id')
     .get(categorie.getById)
     .delete(categorie.deleteOne);*/

    router.route('/categorie/:id')
        .get(categorie.getById)
    router.route('/categorie/:id/article')
        .get(categorie.getArticle)
    router.route('/categorie/:id/journal')
        .get(categorie.getJournal)

    router.route('/journal')
        .post(journal.AddJournal)

    router.route('/categorie')
        .post(categorie.AddCategorie)



module.exports = router;
