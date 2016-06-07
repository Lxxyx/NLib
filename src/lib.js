'use strict'
const utils = require('./utils/utils.js')
const chalk = require('chalk')
const rp = require('request-promise')
const fsp = require('fs-promise')
const cheerio = require('cheerio')
const asy = require('async')
const async = require('asyncawait/async')
const await = require('asyncawait/await')

const booksInfo = function (file) {
  return new Promise(async(function (reslove, reject) {
    let lists
    try {
      if (Array.isArray(file)) {
        lists = file
      } else {
        lists = JSON.parse(await (fsp.readFile(file, 'utf-8')))
      }
    } catch (err) {
      throw err
    }
    // 通过Async控制并发，并把结果汇总
    // 使用Promise保证返回正确结果
    asy.mapLimit(lists, 10, (href, cb) => {
      getPage(href, cb)
    }, (err, result) => {
      if (err) {
        reject(err)
      }
      reslove(result)
    })
  }))
}

const getPage = async(function (href, cb) {
  let options = {
    uri: href,
    transform: function (body) {
      return cheerio.load(body)
    }
  }
  try {
    // 载入页面主体
    let $ = await (rp(options))
      // 获取标题
    let title = utils.getTitle($('script')['8'].children[0].data)
      // 获取前湖-流通书库的标题
    let items = $('#tab_item tr td[title*="前湖-流通书库"]').toArray()
      // 如果没有这本书，则输出不可借阅，并且直接返回。
    if (items.length === 0) {
      // console.log(chalk.red(`${title}不在流通书库中`))
      // console.log(chalk.red(`地址是${href}，请删除该地址后再操作`))
      cb(`Error,${title}不在流通书库`)
    }
    // 获取书的位置
    let location = utils.getLocation(items[0])
      // 获取可借阅数量
    let canBorrowNum = 0
    items.forEach(item => {
        let findState = cheerio.load(item.parent)
        let state = findState('td[width="20%"]').toArray()
        canBorrowNum += utils.isBorrow(state[0].children[0])
      })
      // 加入结果
    cb(null, {
      title,
      location,
      canBorrowNum
    })
  } catch (err) {
    // 处理错误
    cb(err, null)
  }
})

module.exports = booksInfo