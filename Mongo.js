const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://0.0.0.0:27017/abacus?connectTimeoutMS=0&socketTimeoutMS=0';

module.exports = class Mongo {
  connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, db) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }
        this.cps = db.collection('cps');
        this.reduceOutput = db.collection('reduceOutput');
        resolve(db);
      });
    });
  }
};
