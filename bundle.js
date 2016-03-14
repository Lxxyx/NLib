'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

require('babel-polyfill');

var _utils = require('./utils.js');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var chalk = require('chalk');
var rp = require('request-promise');
var fsp = require('fs-promise');
var cheerio = require('cheerio');
var separte = '-----------------------------------------';
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

            booklist.forEach(function (val) {
              getPage(val);
            });

          case 6:
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

    var options, _ret;

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
            return _context3.delegateYield(regeneratorRuntime.mark(function _callee2() {
              var $, items, script, title, location, canBorrowNum;
              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2;
                      return rp(options);

                    case 2:
                      $ = _context2.sent;
                      items = $('#tab_item tr td[title*="前湖-流通书库"]').toArray();
                      script = $('script');
                      title = (0, _utils.getTitle)(script['8'].children[0].data);

                      if (!(items.length === 0)) {
                        _context2.next = 10;
                        break;
                      }

                      console.log(separte);
                      console.log(chalk.red(title + '不在流通书库中'));
                      return _context2.abrupt('return', {
                        v: void 0
                      });

                    case 10:
                      location = (0, _utils.getLocation)(items[0]);
                      canBorrowNum = 0;


                      items.forEach(function (item) {
                        var findState = cheerio.load(item.parent);
                        var state = findState('td[width="20%"]').toArray();
                        canBorrowNum += (0, _utils.isBorrow)(title, state[0].children[0]);
                      });

                      if (canBorrowNum > 0) {
                        console.log(separte);
                        console.log(chalk.green(title));
                        console.log(chalk.white('=> ' + canBorrowNum + '本可借   ' + '位置' + location));
                      } else {
                        console.log(separte);
                        console.log(chalk.yellow(title + '========> 暂无可借书籍'));
                      }

                    case 14:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, _callee2, _this);
            })(), 't0', 3);

          case 3:
            _ret = _context3.t0;

            if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt('return', _ret.v);

          case 6:
            _context3.next = 11;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t1 = _context3['catch'](1);

            console.log(chalk.red(_context3.t1));

          case 11:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[1, 8]]);
  }));

  return function getPage(_x2) {
    return ref.apply(this, arguments);
  };
}();

readList('./list.json');
