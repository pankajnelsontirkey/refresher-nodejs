const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const { DB_MONGODB_URL, DB_MONGODB_NAME } = process.env;
let _db;

const mongoDbConnect = (cb) => {
  MongoClient.connect(DB_MONGODB_URL)
    .then((client) => {
      console.log('Connected to mongodb!');
      _db = client.db(DB_MONGODB_NAME);

      cb();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database connection!';
};

exports.mongoDbConnect = mongoDbConnect;
exports.getDb = getDb;
