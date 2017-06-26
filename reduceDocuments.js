// This module will reduce analytic dats from 4 times an hour to 1 time an hour for entries which are 30 days old.
const mapper = function() {
  if (!this.analytics || this.analytics.length === 0) return;
  const newData = [];

  const filterDate = (date) => {
    // loop through new data
    for (let i = 0; i < newData.length ; i++) {
      const findDate = new Date(newData[i].date);
      if (findDate.getTime() === date.getTime()) {
        // the time has been found in the array, we need to return the array back
        return i;
      }
    }
    // it was not found, so we return a -1
    return -1;
  };

  // param 1 is the new array constructed from this module
  // param 2 is the item which we need to combine in the new list item
  const combine = (pos, rowM) => {
    const row = rowM;

    Object.keys(newData[pos]).forEach(function(prop) {
      if (typeof newData[pos][prop] === 'number') {
        if (row[prop] !== undefined) {
          newData[pos][prop] += row[prop];
          delete row[prop];
        }
      } else if (typeof newData[pos][prop] === 'object') {
        if (row[prop] !== undefined) {
          Object.keys(newData[pos][prop]).forEach(function(sub) {
            if (row[prop][sub] !== undefined) {
              newData[pos][prop][sub] += row[prop][sub];
              delete row[prop][sub];
            }
          });
          // anything that is left in row, move to the new data
          Object.keys(row[prop]).forEach(function(sub) {
            newData[pos][prop][sub] = row[prop][sub];
            delete row[prop][sub];
          });
          delete row[prop];
        }
      }
    });
    // heck if any root items are left in row
    Object.keys(row).forEach(function(prop) {
      newData[pos][prop] = row[prop];
      delete row[prop];
    });
  };

  this.analytics.forEach((row) => {
    const r = row;
    const min = new Date(startDate);
    const max = new Date(endDate);
    const date = new Date(r.date);
    if (date.getTime() > min.getTime() && date.getTime() < max.getTime() && r.views > 3) {
      if (date.getMinutes() >= 15) {
        date.setHours(date.getHours() + 1, 0, 0, 0);
        r.date = date;
      }
      const pos = filterDate(date);
      if (pos === -1) {
        // it is not in the array yet, add it
        newData.push(r);
      } else {
        // it was found at the array position that was returned
        combine(pos, r);
      }
    }
  });

  emit(this._id, newData);
};

const reducer = function(key, data) {
  return data;
};

const mapreduce = (db, startDate, endDate) => {
  console.log('Started MapReduce');
  const options = {
    query: { 'analytics.date': { $gt: startDate, $lt: endDate } },
    out: 'reduceOutput',
    scope: {
      startDate,
      endDate,
    },
  };

  return db.cps.mapReduce(
    mapper,
    reducer,
    options,
  );
};

module.exports = mapreduce;
