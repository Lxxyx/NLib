'use strict'
import 'babel-polyfill'
import { getTitle , getLocation , isBorrow} from '../utils/utils'
import chalk from 'chalk'
import rp from 'request-promise'
import fsp from 'fs-promise'
import cheerio from 'cheerio'
import asy from 'async'

var booksInfo = function (file) {
  return new Promise(async function (reslove, reject) {
    let lists = JSON.parse(await fsp.readFile(file, 'utf-8'))
    asy.mapLimit(lists, 5, (href, cb) => {
      getPage(href, cb)
    }, (err, result) => {
      err ? reject(err) : reslove(result)
    })
  })
};

var getPage = async function (href, cb) {
  let options = {
    uri: href,
    transform: function (body) {
      return cheerio.load(body);
    }
  };
  try {
    // 载入页面主体
    let $ = await rp(options);
    // 获取标题
    let title = getTitle($('script')['8'].children[0].data)
    // 获取前湖-流通书库的标题
    let items = $('#tab_item tr td[title*="前湖-流通书库"]').toArray();
    // 如果没有这本书，则输出不可借阅，并且直接返回。
    if (items.length === 0) {
      console.log(separte)
      console.log(chalk.red(`${title}不在流通书库中`))
      return;
    }
    // 获取书的位置
    let location = getLocation(items[0]);
    // 获取可借阅数量
    let canBorrowNum = 0;
    items.forEach(item => {
      let findState = cheerio.load(item.parent)
      let state = findState('td[width="20%"]').toArray()
      canBorrowNum += isBorrow(state[0].children[0])
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
}

export {
  booksInfo
}