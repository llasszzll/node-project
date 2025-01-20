const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

// G1y6YtEu7pTWgUBQ

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://llasszzll:G1y6YtEu7pTWgUBQ@cannabury.0gqsb.mongodb.net/?retryWrites=true&w=majority&appName=cannabury')
        .then(client => {
            console.log('Connected MongoDB!');
            _db = client.db(); //calling let _db
            callback();
        })
        .catch(err => {
            console.log(err);
            throw err;
        })
}

// function: check if is set, if not, no entry
const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No Database Found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;