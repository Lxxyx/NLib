import { booksInfo } from './../src/lib/lib'
var expect = require('chai').expect;

describe('图书馆模块测试', function () {
  it('查找图书的程序存在', function () {
    expect(booksInfo).to.exist;
  });
  it('查找图书的程序是个函数', function () {
    expect(booksInfo).to.be.instanceOf(Function)
  });
  it('返回结果是个数组', function () {
    booksInfo('./lib.test.json')
      .then(data => {
        expect(data).to.be.instanceOf(Array);
      })
  });
});