var { booksInfo } = require('./../src/lib.js')
var { expect } = require('chai')

describe('图书馆模块测试', () => {
  it('查找图书的程序存在', () => {
    expect(booksInfo).to.exist
  })
  it('查找图书的程序是个函数', () => {
    expect(booksInfo).to.be.instanceOf(Function)
  })
  it('返回结果是个数组', () => {
    booksInfo(`${process.cwd()}/test/lib.test.json`)
      .then(data => {
        expect(data).to.be.instanceOf(Array)
      })
  })
})
