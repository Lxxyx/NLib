南昌大学图书馆插件 [status](https://api.travis-ci.org/Lxxyx/ncu-libary.svg?branch=master)
## 介绍
用于查询图书是否能借阅。一次性查询多本图书，省时省力。
同时设置并发数为5，防止被封禁。
## 运行方式
```javascript
npm install ncu-libary --save
```

将要查找的图书地址，放入一个json文件中即可。
### 格式如下：
用数组方式，放置网址。或者传入数组
```javascript
[
  "http://210.35.251.243/opac/item.php?marc_no=0000833661",
  "http://210.35.251.243/opac/item.php?marc_no=0000840261"
]
```
## 使用：
```javascript
var lib = require('ncu-libary')
// 函数内填数组，如:
var list = [
  "http://210.35.251.243/opac/item.php?marc_no=0000833661",
  "http://210.35.251.243/opac/item.php?marc_no=0000840261"
]
lib.booksInfo(list)
  .then(data => {
    // 对获取到的图书数据进行操作
  })
  .catch(err => {
    // 错误处理
  })

// 查询用户借阅书籍
lib.lend(username, password = '123456')
.then(data => console.log(data))

// 查询书籍,默认只能查询前湖校区的图书
lib.search(bookname, page = 1)
.then(data => {
  console.log(data)
})

// 续借
lib.relend(uri)
.then(data => console.log(data)
.catch(err => console.log(err)
```

### 返回的格式：

```javascript
[{ 
  // 图书标题
  title: '《图解CSS3核心技术与案例实战》',
  // 图书在流通书库的位置
  location: 'TP393.092.2/143 ',
  // 图书的可借阅数量
  canBorrowNum: 0 
}]
```
## 开发
```
git clone https://github.com/Lxxyx/ncu-libary
cd ncu-libary
npm install
gulp
```
### 测试
全局安装mocha
```
npm i mocha -g
```
然后:
```
npm test
```
