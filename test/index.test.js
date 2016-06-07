const lib = require('./../index.js')
const { expect } = require('chai')

describe('index模块入口测试', () => {
  it('index应该是个对象', () => {
    expect(lib).to.be.instanceOf(Object)
  })
})
