const rp = require('request-promise')
const cheerio = require('cheerio')
const async = require('asyncawait/async')
const await = require('asyncawait/await')

const options = {
  login: {
    method: 'POST',
    uri: 'http://mcwaplib.ncu.edu.cn/irdUser/login/opac/opacLogin.jspx',
    resolveWithFullResponse: true,
    form: {
      'backurl': '/user/uc/showUserCenter.jspx',
      'schoolid': '1233',
      'userType:': '0',
      'username': '',
      'password': ''
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/50.0.2661.102 Chrome/50.0.2661.102 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': ''
    }
  },
  index: {
    uri: 'http://waplib.ncu.edu.cn',
    resolveWithFullResponse: true
  },
  lend: {
    uri: 'http://mcwaplib.ncu.edu.cn/cmpt/opac/opacLink.jspx?stype=1',
    transform(body) {
      return cheerio.load(body)
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/50.0.2661.102 Chrome/50.0.2661.102 Safari/537.36',
      'Cookie': ''
    }
  }

}

const re = /.*?;/i

const getRemain = back => {
  let milli = back.getTime() - new Date().getTime()
  return Math.trunc(milli / (1000 * 3600 * 24))
}

const getCookie = (array) => {
  array = array.map(val => re.exec(val)[0])
  return array.join('')
}

const info = html => {
  let $ = cheerio.load(html)
  let info = {
    code: $('tr:nth-child(1) > td').text(),
    title: $('tr:nth-child(2) > td').text(),
    lend: $('tr:nth-child(3) > td').text(),
    back: $('tr:nth-child(4) > td').text(),
    place: $('tr:nth-child(5) > td').text(),
    attach: $('tr:nth-child(6) > td').text(),
    reLend: `http://ms.waplib.ncu.edu.cn/${$('tr:nth-child(7) > td > form').attr('action')}`
  }
  info.remain = getRemain(new Date(info.back))
  return info
}

const lendInfo = array => {
  let infos = []
  array.forEach(val => infos.push(info(val)))
  return infos
}

const lend = (username, password = '123456') => new Promise(async((resolve, reject) => {
  try {
    let indexCookie = await (rp(options.index)).headers['set-cookie']
    options.login.headers.Cookie = getCookie(indexCookie)
    options.login.form.username = username
    options.login.form.password = password
    let loginCookie = await (rp(options.login).catch(e => e.response.headers['set-cookie']))
    options.lend.headers.Cookie = getCookie(loginCookie)
    let $ = await (rp(options.lend))
    let lendArr = $('body > div.box.gcDetail > div > div > div > table').toArray()
    let infos = lendInfo(lendArr)
    resolve(infos)
  } catch (err) {
    reject(err)
  }
}))

module.exports = lend
