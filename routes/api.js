


const express = require('express')
const router = express.Router()
const article=require('../controllers/article')
const journal=require('../controllers/journal')
const categorie=require('../controllers/categorie')
const Model=require('../models/article.js')

Model.createMapping(function(err,mapping){

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
});
router.post('/search',function (req,res,next) {
    res.redirect('/search?q=' +req.body.q);

});

router.get('/search',function (req,res,next) {
    if(req.query.q){
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
    }

});
router.get('/article', article.getAndFindArticles);
router.get('/articleByDate', article.getByDate);
router.get('/journal',journal.listAll);
router.get('/categorie',categorie.listAll);

router.route('/journal/:id')
    .get(journal.getById)
router.route('/journal/:id/article')
    .get(journal.getArticles)

router.route('/article/:id')
    .get(article.getById)
router.route('/SimilarArticle/:id')
    .get(article.getSimilarArticle)

router.route('/categorie/:id')
    .get(categorie.getById)
router.route('/categorie/:id/article')
    .get(categorie.getArticle)
router.route('/categorie/:id/journal')
    .get(categorie.getJournal)

router.route('/journal')
    .post(journal.AddJournal)

module.exports = router;