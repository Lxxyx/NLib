var lib = require('./dist/lib/lib.js');

var canBorrow = lib.readList('./data/lib.json');
console.log(canBorrow)