// This module will reduce analytic dats from 4 times an hour to 1 time an hour for entries which are 30 days old.

module.exports = (db, startDate, endDate) => {
  console.log('Started Removing old documents');
  return db.cps.update({}, { $pull: { analytics: { date: { $gte: startDate, $lt: endDate } } } }, { multi: true });
};
