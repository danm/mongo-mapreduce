const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://0.0.0.0:27017/abacus?connectTimeoutMS=0&socketTimeoutMS=0';
// const url =  'mongodb://10.38.168.196:27017,10.38.172.198:27017/?replicaSet=telescope&connectTimeoutMS=0&socketTimeoutMS=0';

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
