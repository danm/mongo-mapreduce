module.exports = (db) => {
  return new Promise((resolve, reject) => {
    console.log('Started adding reduce collection in');
    const cursor = db.reduceOutput.find({});
    cursor.on('data', (d) => {
      db.cps.update({_id: d._id}, { $addToSet: { analytics: { $each: d.value } } });
    });
    cursor.on('end', () => {
      resolve();
    });
    cursor.on('error', (e) => {
      reject(e);
    });
  });
};
