'use strict';

require('babel-polyfill');

var _utils = require('./utils.js');

var _mail = require('./mail.js');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var chalk = require('chalk');
var rp = require('request-promise');
var fsp = require('fs-promise');
var cheerio = require('cheerio');
var separte = '-----------------------------------------';

var queueLength,
    wheel = 0,
    postQueue = [];

var readList = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(filePath) {
    var booklist;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = JSON;
            _context.next = 3;
            return fsp.readFile(filePath, 'utf-8');

          case 3:
            _context.t1 = _context.sent;
            booklist = _context.t0.parse.call(_context.t0, _context.t1);

            queueLength = booklist.length;
            booklist.forEach(function (val) {
              getPage(val);
            });

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function readList(_x) {
    return ref.apply(this, arguments);
  };
}();

var getPage = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(uri) {
    var _this = this;

    var options, $, items, script, title, location, canBorrowNum, bookState;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            options = {
              uri: uri,
              transform: function transform(body) {
                return cheerio.load(body);
              }
            };
            _context3.prev = 1;
            _context3.next = 4;
            return rp(options);

          case 4:
            $ = _context3.sent;
            items = $('#tab_item tr td[title*="前湖-流通书库"]').toArray();
            script = $('script');
            title = (0, _utils.getTitle)(script['8'].children[0].data);

            if (!(items.length === 0)) {
              _context3.next = 12;
              break;
            }

            console.log(separte);
            console.log(chalk.red(title + '不在流通书库中'));
            return _context3.abrupt('return');

          case 12:
            location = (0, _utils.getLocation)(items[0]);
            canBorrowNum = 0;


            items.forEach(function (item) {
              var findState = cheerio.load(item.parent);
              var state = findState('td[width="20%"]').toArray();
              canBorrowNum += (0, _utils.isBorrow)(state[0].children[0]);
            });

            bookState = {
              title: title,
              location: location,
              canBorrow: 0
            };


            if (canBorrowNum > 0) {
              console.log(separte);
              console.log(chalk.green(title));
              console.log(chalk.white('=> ' + canBorrowNum + '本可借   ' + '位置 ' + location));
              bookState.canBorrow = canBorrowNum;
              postQueue.push(bookState);
            } else {
              console.log(separte);
              console.log(chalk.yellow(title + '========> 暂无可借书籍'));
            }

            queueLength -= 1;

            if (queueLength === 0) {
              console.log(chalk.white(separte));
              wheel += 1;
              console.log(chalk.white('第 ' + wheel + ' 轮结束'));
              console.log(chalk.white(separte));

              fsp.writeFile('./push.json', JSON.stringify(postQueue)).then(_asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                var data, strVar, x;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.t0 = JSON;
                        _context2.next = 3;
                        return fsp.readFile('./push.json', 'utf-8');

                      case 3:
                        _context2.t1 = _context2.sent;
                        data = _context2.t0.parse.call(_context2.t0, _context2.t1);
                        strVar = "";

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
                        for (x in data) {
                          strVar += '<p>' + '<span>' + '书籍名称：' + data[x].title + '</span>' + '</br>' + '<span>' + '书籍位置：' + data[x].location + '</span>' + '<span>' + '可借阅数量：' + data[x].canBorrow + '</span>' + '</p>' + '</hr>';
                        }
                        strVar += "<\/body>";
                        strVar += "<\/html>";
                        (0, _mail.sendMail)(strVar);

                      case 23:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, _this);
              }))).catch(function (err) {
                console.log(err);
              });
            }

            _context3.next = 24;
            break;

          case 21:
            _context3.prev = 21;
            _context3.t0 = _context3['catch'](1);

            console.log(chalk.red(_context3.t0));

          case 24:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[1, 21]]);
  }));

  return function getPage(_x2) {
    return ref.apply(this, arguments);
  };
}();

readList('./list.json');
// setInterval(function() {
//   if (queueLength > 0) return;
//   readList('./list.json')
// }, 1*60*1000)
