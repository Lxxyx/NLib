'use strict'
import 'babel-polyfill'
import { getTitle, isBorrow, getLocation } from './utils.js'
import {sendMail} from './mail.js'
const chalk = require('chalk');
const rp = require('request-promise');
const fsp = require('fs-promise');
const cheerio = require('cheerio');
const separte = '-----------------------------------------';

var queueLength, 
    wheel = 0,
    postQueue = [];

const readList = async function(filePath) {
  let booklist = JSON.parse(await fsp.readFile(filePath, 'utf-8'));
  queueLength = booklist.length;
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
      canBorrowNum += isBorrow(state[0].children[0])
    })

    let bookState = {
      title    :title,
      location :location,
      canBorrow:0
    }

    if (canBorrowNum > 0) {
      console.log(separte)
      console.log(chalk.green(title));
      console.log(chalk.white('=> '+canBorrowNum+'本可借   ' + '位置 '+location))
      bookState.canBorrow = canBorrowNum
      postQueue.push(bookState);
    } else {
      console.log(separte)
      console.log(chalk.yellow(`${title}========> 暂无可借书籍`));
    }

    queueLength -= 1;

    if (queueLength === 0) {
      console.log(chalk.white(separte))
      wheel+=1;
      console.log(chalk.white(`第 ${wheel} 轮结束`))
      console.log(chalk.white(separte))

      fsp.writeFile('./push.json',JSON.stringify(postQueue))
        .then(async () => {
          let data = JSON.parse(await fsp.readFile('./push.json','utf-8'));
          var strVar="";
          strVar += "<!DOCTYPE html>";
          strVar += "<html lang=\"zh-cn\">";
          strVar += "<head>";
          strVar += "  <meta charset=\"UTF-8\">";
          strVar += "  <title>Document<\/title>";
          strVar += "  <style type=\"text\/css\">";
          strVar += "    span {";
          strVar += "      display:inline-block;";
          strVar += "      padding: 10px;";
          strVar += "    }";
          strVar += "  <\/style>";
          strVar += "<\/head>";
          strVar += "<body>";
          for(let x in data) {
              strVar +='<p>'+
              '<span>'+'书籍名称：'+data[x].title+'</span>'+'</br>'+
              '<span>'+'书籍位置：'+data[x].location+'</span>'+
              '<span>'+'可借阅数量：'+data[x].canBorrow+'</span>'+
              '</p>'+'</hr>'
          }
          strVar += "<\/body>";
          strVar += "<\/html>";
          sendMail(strVar)
        })
        .catch(err => {
          console.log(err)
        })
    }

  } catch (err) {
    console.log(chalk.red(err))
  }
}

readList('./list.json')
// setInterval(function() {
//   if (queueLength > 0) return;
//   readList('./list.json')
// }, 1*60*1000)

