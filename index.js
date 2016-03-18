var lib = require('./dist/lib/lib.js');

lib.booksInfo('data/lib.json')
  .then(data => {
    console.log(data)
  })
  .catch(err => {
    console.log(err)
  })