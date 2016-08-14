const relend = require('./../src/relend.js')
const { expect } = require('chai')

describe('续借模块测试', () => {
  it('续借函数应该存在', () => {
    expect(relend).to.be.instanceOf(Function)
  })
  // it('续借失败应该返回错误', done => {
  //   relend('http://ms.waplib.ncu.edu.cn/sms/opac/user/lendStatus.action?sn=DFA53AD4C99FA69531445C0BB480AB9E9A105B7936AC2ECF271F1F11C4314EE56100C69580BCF0ED32344EF3BF24755768E68A0CF1E7E7FD9FFA6B0ADBEF0137511F792EB4D5A94F&codepa=AN1283999&check=B28B577B&xc=6')
  //   .then(data => {
  //     expect(data).to.be.instanceOf(Object)
  //     expect(data.status).equal(400)
  //     done()
  //   })
  //   .catch(e => done(e))
  // })
})