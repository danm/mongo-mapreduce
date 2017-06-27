const fs = require('fs');
const zlib = require('zlib');

const reader = fs.createReadStream('./out.log');
const zipper = zlib.createGzip();
const writer = fs.createWriteStream('./out.log.gzip');

reader.pipe(zipper).pipe(writer);