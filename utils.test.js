var expect = require('chai').expect;
import {getTitle} from './utils'

describe('标题正则的测试', function () {
  it('中文标题', function () {
    expect(getTitle('document.title = "平凡的世界"')).to.be.equal('《平凡的世界》');
  });
  it('英文标题', function () {
    expect(getTitle('document.title = "Manual of critical care /"')).to.be.equal('《Manual of critical care /》');
  });
  it('其它标题', function () {
    expect(getTitle('document.title = "300ЛОГИЧЕСКИЙ  ЖУРНАЛ."')).to.be.equal('《300ЛОГИЧЕСКИЙ  ЖУРНАЛ.》');
  });
});
