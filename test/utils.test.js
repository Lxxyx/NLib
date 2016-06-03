var expect = require('chai').expect
var { getTitle, isBorrow } = require('../src/utils/utils.js')

// 标题正则的测试
describe('标题正则', () => {
  it('中文标题', () => {
    expect(getTitle('document.title = "平凡的世界"')).to.be.equal('《平凡的世界》')
  })
  it('英文标题', () => {
    expect(getTitle('document.title = "Manual of critical care /"')).to.be.equal('《Manual of critical care /》')
  })
  it('其它标题', () => {
    expect(getTitle('document.title = "300ЛОГИЧЕСКИЙ  ЖУРНАЛ."')).to.be.equal('《300ЛОГИЧЕСКИЙ  ЖУРНАЛ.》')
  })
})

// 书籍借阅状态的测试
var canBorrow = {
  children: [{
    data: "可借"
  }]
}

var newBook = {
  data: '新书：正在上架'
}

describe('书籍借阅状态', () => {
  it('可借阅', () => {
    expect(isBorrow(canBorrow)).to.be.equal(1)
  })
  it('新书', () => {
    expect(isBorrow(newBook)).to.be.equal(1)
  })
  it('不可借阅，或已借出', () => {
    expect(isBorrow({})).to.be.equal(0)
  })
})
