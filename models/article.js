var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosastic=require('mongoosastic');
var journal = require('../models/journal.js');
var textSearch = require('mongoose-text-search');

var ArticleSchema = new Schema({
    name:String,
    Description: String,
    Picture: String,
    Link : String,
    ArticleId : String ,
    Date :String,
    Likes: Number,
    FullDescription:String,
    _journal : { type: Schema.Types.ObjectId, ref: 'journal' }
});



ArticleSchema.index({ name: 'text', Description: 'text',FullDescription:'text' });

/*ArticleSchema.plugin(textSearch);
ArticleSchema.index({ '$**': 'text' });*/
/*ArticleSchema.plugin(mongoosastic,{
    hosts:[
        'localhost:9200'
    ]
});*/





var Model = mongoose.model('Article', ArticleSchema);

module.exports = Model;