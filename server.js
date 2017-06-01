
var PORT = 5000 || process.env.PORT;
var cronjob = require('./commons/cronjob');
var mainRouter = require('./routes/index');
var apiRouter = require('./routes/api');
//var DB = "mongodb://admin:admin@ds153400.mlab.com:53400/smartjournal" ;
var DB = "mongodb://admin:admin@ds137891.mlab.com:37891/smart2";
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan');
var cheerio = require('cheerio');
var cors = require('cors')

var app = express();

// Cross Origin middleware
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
})

app.use(cors())

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', mainRouter);
app.use('/api', apiRouter);
mongoose.Promise = global.Promise;
mongoose.connect(DB, function(err) {
    if (err) {
        return err;
    } else {
        console.log('Successfully connected to ' + DB);
    }
});

/*app.set('views', __dirname + '/client/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'client')));*/
cronjob();


app.set('port', (process.env.PORT || 5000));


//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});

module.exports =app;
