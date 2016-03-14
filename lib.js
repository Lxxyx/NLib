'use strict'
import 'babel-polyfill'
import { getTitle, isBorrow, getLocation } from './utils.js'
const chalk = require('chalk');
const rp = require('request-promise');
const fsp = require('fs-promise');
const cheerio = require('cheerio');
const separte = '-----------------------------------------';
const readList = async function(filePath) {
  let booklist = JSON.parse(await fsp.readFile(filePath, 'utf-8'));
  booklist.forEach(val => {
    getPage(val)
  })
}

const getPage = async function(uri) {
  let options = {
    uri: uri,
    transform: function(body) {
      return cheerio.load(body);
    }
  };
  try {
    let $ = await rp(options);
    let items = $('#tab_item tr td[title*="前湖-流通书库"]').toArray();
    let script = $('script');
    let title = getTitle(script['8'].children[0].data)

    if (items.length === 0) {
      console.log(separte)
      console.log(chalk.red(`${title}不在流通书库中`))
      return;
    }
    let location = getLocation(items[0]);
    let canBorrowNum = 0;

    items.forEach(item => {
      let findState = cheerio.load(item.parent)
      let state = findState('td[width="20%"]').toArray()
      canBorrowNum += isBorrow(title, state[0].children[0])
    })

    if (canBorrowNum > 0) {
      console.log(separte)
      console.log(chalk.green(title));
      console.log(chalk.white('=> '+canBorrowNum+'本可借   ' + '位置'+location))
    } else {
      console.log(separte)
      console.log(chalk.yellow(`${title}========> 暂无可借书籍`));
    }

  } catch (err) {
    console.log(chalk.red(err))
  }
}

readList('./list.json')
