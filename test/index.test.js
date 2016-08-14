const lib = require('./../index.js')
const expect = require('chai').expect

describe('index模块入口测试', () => {
  it('index应该是个对象', () => {
    expect(lib).to.be.instanceOf(Object)
  })
  it('index对象里应该都是函数', () => {
    for(let x in lib) {
      expect(lib[x]).to.be.instanceOf(Function)
    }
  })
})
