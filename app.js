var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/bookinventory';

app.use(bodyParser.json());

app.get('/', function (req, res) {

    res.send('Hello World!');
});

app.post('/stock', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        db.collection('books').updateOne(
            {isbn: req.body.isbn},
            {isbn: req.body.isbn, count: req.body.count},
            {upsert: true}
        );
    });
    res.json({isbn: req.body.isbn, count: req.body.count})
});

app.get('/stock', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        db.collection('books').find({}).toArray(function(err, results) {
            res.json(results);
        });
    });
});

app.use(clientError);
app.use(serverError);


function clientError(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}

function serverError(err, req, res, next) {
    res.status(err.status || 500);
    console.error(err.stack);
    res.json({
        message: err.message,
        error: (process.env.NODE_ENV === 'production') ? {} : err.stack
    });
}

module.exports = app;