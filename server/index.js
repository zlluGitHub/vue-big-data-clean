const express = require('express');
const app = express()
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');

// 引入json解析中间件 解决上传内容太多失败
let bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//设置跨域访问
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  // res.header("X-Powered-By", ' 3.2.1');
  // res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(express.static(path.join(__dirname, '../dist')))

app.use('/dataClear', require('./routes'));

// 创建服务
let port = 8888;

let server = http.createServer(app);
server.listen(port)
server.on('error', function () {
  console.log("service startup failed！");
});
server.on('listening', function () {
  console.log("server listening at http://localhost:" + port);
});
mongoose.connect(`mongodb://127.0.0.1:27017/test`, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
  if (err) {
    console.log('Connection Error:' + err);
  } else {
    console.log('数据库连接成功!');
  }
});