var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/bookinventory';

var collectionPromise = MongoClient
    .connect(url, {db: {bufferMaxEntries: 0}})
    .then(function (db) {
        return db.collection('books')
    });

module.exports = {
    stockUp: function (isbn, count) {
        return collectionPromise.then(function (collection) {
            collection.updateOne(
                {isbn: isbn},
                {isbn: isbn, count: count},
                {upsert: true}
            );
        })
    },
    findAll: function () {
        return collectionPromise
            .then(function (collection) {
                return collection.find({}).toArray();
            });
    }
};