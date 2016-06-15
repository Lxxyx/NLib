const rp = require('request-promise')
const cheerio = require('cheerio')
const async = require('asyncawait/async')
const await = require('asyncawait/await')

let options = {
  uri: '',
  transform(body) {
    return cheerio.load(body)
  }
}

const relend = uri => new Promise(async((reslove, reject) => {
  options.uri = uri
  try {
    let $ = await (rp(options))
    let result = $('td font').text()
    if (result.indexOf('不得') > 0) {
      reslove({
        status: 400,
        message: result
      })
    } else if (result.indexOf('成功') > 0) {
      reslove({
        status: 200,
        message: result
      })
    } else {
      reslove(result)
    }
  } catch (e) {
    reject(e)
  }
}))

module.exports = relend