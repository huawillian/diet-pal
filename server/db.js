let MongoClient = require('mongodb').MongoClient;
let url = 'mongodb://huawillian:huawillian@ds231205.mlab.com:31205/dietpaldb';
let _db = null;

MongoClient.connect(url, function(err, db) {
  console.log("DB connected correctly to server.");
  _db = db;
});

let getDB = () => _db;

let closeDB = () => _db.close();

module.exports = {getDB, closeDB}