module.exports = (db) => {
  console.log('Dropping reduced collection');
  return db.reduceOutput.drop();
};
