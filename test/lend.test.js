const lend = require('./../src/lend.js')
const { expect } = require('chai')

describe('借阅模块测试', () => {
  it('借阅函数应该存在', () => {
    expect(lend).to.exist
  })
  it('借阅函数应该是个函数', () => {
    expect(lend).to.be.instanceOf(Function)
  })
  it('借阅函数应该返回数组', () => {
    lend('7102314023')
    .then(data => {
      expect(data).to.be.instanceOf(Array)
    })
  })
})