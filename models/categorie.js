/**
 * Created by nour on 4/5/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var journal = require('../models/journal.js');
var CategorieSchema = new Schema({
    name:String,
    _journal : [{ type: Schema.Types.ObjectId, ref: 'Journal' }]
});

var categorie = mongoose.model('Categorie', CategorieSchema);

module.exports = categorie;