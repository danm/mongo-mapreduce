const readline = require('readline');
const fs = require('fs');
const zlib = require('zlib');
const Mongo = require('./Mongo');

const runx = async () => {
  const db = new Mongo();
  await db.connect();

  const zipper = zlib.Gzip();
  const zipped = fs.createReadStream('./out.log').pipe(zipper);

  const rl = readline.createInterface({
    input: zipped,
  });

  rl.on('line', async (line) => {
    const d = JSON.parse(line);
    d.analytics.date = new Date(d.analytics.date);
    try {
      await db.cps.updateOne({ _id: d._id }, { $push: { analytics: d.analytics } });
    } catch (e) {
      console.log(e);
    }
  });
};

runx();
