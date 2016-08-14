const search = require('./../src/search.js')
const expect = require('chai').expect

describe('搜索模块测试', () => {
  it('搜索函数应该存在', () => {
    expect(search).to.be.instanceOf(Function)
  })
  it('搜索结果应该返回数组', done => {
    search('web')
      .then(data => {
        expect(data).to.be.instanceOf(Array)
        done()
      })
      .catch(e => done(e))
  })
  it('搜索第二页的结果应该返回数组', done => {
    search('web', 2)
      .then(data => {
        expect(data).to.be.instanceOf(Array)
        done()
      })
      .catch(e => done(e))
  })
  it('搜索结果应该包含标题等信息', done => {
    search('web')
      .then(data => {
        let info = data[0]
        expect(info.title).to.exist
        expect(info.location).to.exist
        expect(info.marc_no).to.exist
        done()
      })
      .catch(e => done(e))
  })
  it('搜索中文，应该返回正确的数组', done => {
    search('深入理解')
      .then(data => {
        expect(data).to.be.instanceOf(Array)
        expect(data.length).equal(20)
        done()
      })
      .catch(e => done(e))
  })
})
