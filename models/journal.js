
var Model = require('../models/article.js');
var categorie = require('../models/categorie.js');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var JournalSchema = new Schema({
    lienFb: String,
    picture:String,
    articles: [ { type: Schema.ObjectId, ref: 'Article' }] ,
    _categorie : { type: Schema.Types.ObjectId, ref: 'Categorie' }
});

var journal = mongoose.model("Journal", JournalSchema);
module.exports = journal;


