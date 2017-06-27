const Mongo = require('./Mongo');
const fs = require('fs');

const runx = async () => {
  const db = new Mongo();
  await db.connect();

  const startDate = new Date();
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 7);
  endDate.setHours(0, 0, 0, 0);

  console.log('starting');
  const cursor = db.cps.aggregate([
    { $match: { 'analytics.date': { $gte: startDate, $lt: endDate } } },
    { $project: { analytics: 1 } },
    { $unwind: '$analytics' },
    { $match: { 'analytics.date': { $gte: startDate, $lt: endDate } } }
  ]);

  cursor.on('data', (d) => {
    fs.appendFileSync('./out.log', JSON.stringify(d) + '\n');
  });

  cursor.on('end', (d) => {
    console.log('cursor has finsihed');
  });

  cursor.on('error', (e) => {
    console.log('cursor error');
    console.log(e)
  });
};

runx();
