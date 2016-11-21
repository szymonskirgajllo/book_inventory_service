var express = require('express');
var bodyParser = require('body-parser');

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

module.exports = function(stockRepository) {
    var app = express();

    app.use(bodyParser.json());

    app.get('/', function (req, res) {

        res.send('Hello World!');
    });


    app.post('/stock', function (req, res, next) {
        stockRepository.stockUp(req.body.isbn, req.body.count).then(function () {
            res.json({isbn: req.body.isbn, count: req.body.count});
        }).catch(next);


    });

    app.get('/stock', function (req, res, next) {
        stockRepository.findAll()
            .then(function (results) {
                res.json(results);
            })
            .catch(next);

    });

    app.get('/stock/:isbn', function (req, res, next) {
        stockRepository.
            getCount(req.params.isbn).
            then(function (result) {
                if (result) {
                    res.json({count: result});
                } else {
                    res.status(404).send('No book with isbn ' + req.params.isbn);
                }
            }).
            catch(next);
    });

    app.use(clientError);
    app.use(serverError);

    return app;
};