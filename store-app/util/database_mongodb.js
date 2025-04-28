const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const { DB_MONGODB_URL } = process.env;

const mongoDbConnect = (cb) => {
  MongoClient.connect(DB_MONGODB_URL)
    .then((client) => {
      console.log('Connected to mongodb!');
      cb(client);
    })
    .catch((err) => console.log(err));
};

module.exports = mongoDbConnect;
