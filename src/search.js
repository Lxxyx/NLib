const rp = require('request-promise')
const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const async = require('asyncawait/async')
const await = require('asyncawait/await')

const options = {
  uri: '',
  transform(body) {
    return cheerio.load(body)
  }
}

const re = {
  title: /\d+\./i,
  location: /\w{1,2}\d{1,3}.+\/\d+/i,
  bookNum: /\d+/i,
  marc_no: /\d+/i
}

const getInfo = html => {
  let $ = cheerio.load(html)
  let location = $('h3').clone().children().empty().parent().text()
  let [author, publishing] = $('p').clone().children().empty().parent().text().split('\r\n\t')
  let [totalBook, canBorrowNum] = $('p span').text().split('\r\n\t')

  let info = {
    title: $('h3 a').text().replace(re.title, ''),
    location: location.trim(),
    author: author.trim(),
    marc_no: re.marc_no.exec($('a').attr('href'))[0],
    publishing: publishing.trim(),
    type: $('h3 span').text(),
    totalBook: re.bookNum.exec(totalBook)[0],
    canBorrowNum: re.bookNum.exec(canBorrowNum)[0]
  }
  return info
}


const search = (title, page = 1) => new Promise(async((reslove, reject) => {
  try {
    options.uri = `http://210.35.251.243/opac/openlink.php?location=03000&page=${page}&title=${title}&doctype=ALL&lang_code=ALL&match_flag=forward&displaypg=20&showmode=list&orderby=DESC&sort=CATA_DATE&onlylendable=no&count=179&with_ebook=on`
    let $ = await (rp(options))
    let bookArr = $('.book_list_info').toArray()
    let total = $('.search_form strong').text()
    let infos = []
    bookArr.forEach(val => {
      let info = getInfo(val)
      info.totalNum = total
      infos.push(info)
    })
    reslove(infos)
  } catch (e) {
    reject(e)
  }
}))

module.exports = search
