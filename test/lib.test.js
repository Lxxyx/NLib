const { booksInfo } = require('./../src/lib.js')
const { expect } = require('chai')

const list = [
  "http://210.35.251.243/opac/item.php?marc_no=0000833661",
  "http://210.35.251.243/opac/item.php?marc_no=0000840261"
]

describe('图书馆模块测试', () => {
  it('查找图书的程序存在', () => {
    expect(booksInfo).to.exist
  })
  it('查找图书的程序是个函数', () => {
    expect(booksInfo).to.be.instanceOf(Function)
  })
  it('JSON文件返回结果是个数组', () => {
    booksInfo(`${process.cwd()}/test/lib.test.json`)
      .then(data => {
        expect(data).to.be.instanceOf(Array)
      })
  })
  it('传入数组返回结果是个数组', () => {
    booksInfo(list)
      .then(data => {
        expect(data).to.be.instanceOf(Array)
      })
  })
})
