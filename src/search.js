const rp = require('request-promise')
const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const async = require('asyncawait/async')
const await = require('asyncawait/await')

const options = {
  uri: '',
  transform: function(body) {
    return cheerio.load(body)
  }
}

const re = {
  title: /\d+\./i,
  location: /\w+\d+.+/i,
  bookNum: /\d+/i
}

const getInfo = html => {
  let $ = cheerio.load(html)
  let [author, publishing] = $('p').clone().children().empty().parent().text().split('\r\n\t')
  let [totalBook, canBorrowNum] = $('p span').text().split('\r\n\t')

  let info = {
    title: $('a').text().replace(re.title, '').replace('馆藏', ''),
    location: re.location.exec($('.book_list_info').text())[0].trimRight(),
    author: author.trim(),
    publishing: publishing.trim(),
    type: $('h3 span').text(),
    totalBook: re.bookNum.exec(totalBook)[0],
    canBorrowNum: re.bookNum.exec(canBorrowNum)[0]
  }
  return info
}

const search = async((title, page = 1) => {
  options.uri = `http://210.35.251.243/opac/openlink.php?location=03000&page=${page}&title=${title}&doctype=ALL&lang_code=ALL&match_flag=forward&displaypg=20&showmode=list&orderby=DESC&sort=CATA_DATE&onlylendable=no&count=179&with_ebook=on`
  let $ = await(rp(options))
  let bookArr = $('.book_list_info').toArray()
  let infos = []
  bookArr.forEach(val => {
    let info = getInfo(val)
    infos.push(info)
  })
  console.log(infos)
})

search('web')