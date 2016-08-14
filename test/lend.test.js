const lend = require('./../src/lend.js')
const expect = require('chai').expect

describe('借阅模块测试', () => {
  it('借阅函数应该存在', () => {
    expect(lend).to.exist
  })
  it('借阅函数应该是个函数', () => {
    expect(lend).to.be.instanceOf(Function)
  })
  // it('成功登陆应该返回借阅信息数组', done => {
  //   lend('7102314023')
  //     .then(data => {
  //       expect(data).to.be.instanceOf(Array)
  //       done()
  //     })
  //     .catch(e => done(e))
  // })
  it('失败登陆应该收到错误提示', done => {
    lend('7102314099')
      .catch(e => {
        expect(e.message).equal('用户名或密码错误')
        done()
      })
  })
})
