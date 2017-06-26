const Mongo = require('./Mongo');
const mapreduce = require('./reduceDocuments');
const removeOldDocuments = require('./removeOldDocuments');
const addReducedDocuments = require('./addReducedDocuments');
const dropReduceCollection = require('./dropReduceCollection');

const start = async () => {
  // filter for only 1 days - 7 days ago
  // const startDate = new Date();
  // startDate.setDate(startDate.getDate() - 7);
  // startDate.setHours(0, 0, 0, 0);
  // const endDate = new Date(startDate);
  // endDate.setDate(endDate.getDate() + 1);

  // filter from the begining of time till 7 days ago.
  const startDate = new Date();
  startDate.setMonth(0, 1);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 7);

  console.log('started');
  try {
    const db = new Mongo();
    await db.connect();
    await mapreduce(db, startDate, endDate);
    await removeOldDocuments(db, startDate, endDate);
    await addReducedDocuments(db);
    await dropReduceCollection(db);
  } catch (e) {
    console.log('error at');
    console.log(e);
  }
  console.log('finsihed');
  process.exit();
};

start();
module.exports = start;
