var express = require('express');
var app = express();

app.use(function (req, res, next) {
    console.log("incoming request at " + new Date());
    next();
});

app.use(function (req, res, next) {
    console.log("basic auth");
    next();
});

var privateMiddleware = function (req, res, next) {
    console.log("private middleware");
    next();
};

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

app.get('/', privateMiddleware, function (req, res) {
    throw new Error("something went wrong");
    res.send('Hello World!');
});

app.use(clientError);
app.use(serverError);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
