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

const getInfo = (html) => {
  let $ = cheerio.load(html)
  let info = {
    title: $('a').text().replace(/\d\./i, '').replace('馆藏', '')

  }
  console.log(info)
}

const search = async((title, page = 1) => {
  options.uri = `http://210.35.251.243/opac/openlink.php?location=03000&page=${page}&title=${title}&doctype=ALL&lang_code=ALL&match_flag=forward&displaypg=20&showmode=list&orderby=DESC&sort=CATA_DATE&onlylendable=no&count=179&with_ebook=on`
  let $ = await(rp(options))
  let bookArr = $('.book_list_info').toArray()
  getInfo(bookArr[0])
})

search('web')