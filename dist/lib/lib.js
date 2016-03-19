'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.booksInfo = undefined;

require('babel-polyfill');

var _utils = require('../utils/utils');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var booksInfo = function booksInfo(file) {
  return new Promise(function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(reslove, reject) {
      var lists;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = JSON;
              _context.next = 3;
              return _fsPromise2.default.readFile(file, 'utf-8');

            case 3:
              _context.t1 = _context.sent;
              lists = _context.t0.parse.call(_context.t0, _context.t1);

              // 通过Async控制并发，并把结果汇总
              // 使用Promise保证返回正确结果
              _async2.default.mapLimit(lists, 10, function (href, cb) {
                getPage(href, cb);
              }, function (err, result) {
                if (err) {
                  reject(err);
                }
                reslove(result);
              });

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x, _x2) {
      return ref.apply(this, arguments);
    };
  }());
};

var getPage = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(href, cb) {
    var options, $, title, items, location, canBorrowNum;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            options = {
              uri: href,
              transform: function transform(body) {
                return _cheerio2.default.load(body);
              }
            };
            _context2.prev = 1;
            _context2.next = 4;
            return (0, _requestPromise2.default)(options);

          case 4:
            $ = _context2.sent;

            // 获取标题
            title = (0, _utils.getTitle)($('script')['8'].children[0].data);
            // 获取前湖-流通书库的标题

            items = $('#tab_item tr td[title*="前湖-流通书库"]').toArray();
            // 如果没有这本书，则输出不可借阅，并且直接返回。

            if (items.length === 0) {
              console.log(_chalk2.default.red(title + '不在流通书库中'));
              console.log(_chalk2.default.red('地址是' + href + '，请删除该地址后再操作'));
              cb('Error,' + title + '不在流通书库');
            }
            // 获取书的位置
            location = (0, _utils.getLocation)(items[0]);
            // 获取可借阅数量

            canBorrowNum = 0;

            items.forEach(function (item) {
              var findState = _cheerio2.default.load(item.parent);
              var state = findState('td[width="20%"]').toArray();
              canBorrowNum += (0, _utils.isBorrow)(state[0].children[0]);
            });
            // 加入结果
            cb(null, {
              title: title,
              location: location,
              canBorrowNum: canBorrowNum
            });
            _context2.next = 17;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2['catch'](1);

            // 处理错误
            cb(_context2.t0, null);

          case 17:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 14]]);
  }));

  return function getPage(_x3, _x4) {
    return ref.apply(this, arguments);
  };
}();

exports.booksInfo = booksInfo;