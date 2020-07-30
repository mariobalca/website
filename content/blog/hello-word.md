---
title: Hello World
date: 2020/07/23
---

This is the content. another piece of content
```js{1,3-5}
const http = require('http')
const bodyParser = require('body-parser')

http.createServer((req, res) => {
  bodyParser.parse(req, (error, body) => {
    res.end(body)
  })
}).listen(3000)
```

![](https://madewithlove.com/static/e9ae9f9deb398aa2672dc13b828d6c62/9269e/blog-elasticsearch-laravel-2019-scaled.jpg)
