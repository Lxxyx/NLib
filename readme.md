## 介绍
用于查询图书是否能借阅。一次性查询多本图书，省时省力。
同时设置并发数为5，防止被封禁。
## 运行方式
```javascript
npm install ncu-libary --save
```

将要查找的图书地址，放入一个json文件中即可。
### 格式如下：
```javascript
[
  "http://210.35.251.243/opac/item.php?marc_no=0000833661",
  "http://210.35.251.243/opac/item.php?marc_no=0000840261"
]
```
### 使用：
```javascript
var nlib = require('ncu-libary')
// 函数内填JSON文件地址
nlib.booksInfo(filepath)
  .then(data => {
    // 对获取到的图书数据进行操作
  })
  .catch(err => {
    // 错误处理
  })
```
### 返回的格式：
```javascript
[{ 
  // 图书标题
  title: '《图解CSS3核心技术与案例实战》',
  // 图书在流通书库的位置
  location: 'TP393.092.2/143 ',
  // 图书的可借阅熟练
  canBorrowNum: 0 
}]
```
## 开发
```
git clone https://github.com/Lxxyx/NLib
cd Nlib
npm install
gulp
```
## TODO
1. 加入邮件提醒功能 // 已完成
2. 放入微信公众号中
3. 加入网络教学平台登录功能
4. 发布至NPM社区 // 已完成