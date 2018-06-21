var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url 
  var queryString = ''
  if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/


  if(path === '/'){//如果你请求的是根文件
    var string = fs.readFileSync('./index.html','utf8')
    var amount = fs.readFileSync('./db','utf8')// 100
    string = string.replace('&&&amount&&&',amount)//替换占位符
    response.setHeader('Content-Type', 'text/html;charset=utf-8')//设置Content-Type
    response.write(string)
    response.end()
  }else if(path === '/pay' ){
    //toUpperCase大写 如果路径是 ./pay 请求方法是 POST
    var amount = fs.readFileSync('./db', 'utf8')//读一下当前有多少钱
    var newAmount = amount - 1//字符串减一 自动会转换成数字 ；扣一块变成 99
    if('Math.randow()>0.5'){//randow会返回0 - 1之间的小数
      fs.writeFileSync('./db', newAmount)//将 99 存在数据库里面
      response.setHeader('Content-Type','application/javascript')//自己说了是javascript
      response.write('')//告诉你成功了
      response.statusCode = 200
      //说明 jack.com后端程序员需要对 jack.com页面细节了解很清楚
      //耦合  解耦
     // response.write('amount.innerText = amount.innerText - 1')// 服务器返回了在浏览器执行的一个js字符串
     response.write(`
     ${query.callback}.call(undefined,{
       "success": true,
       "left": ${newAmount}
     })
    
     `)//对方的网站，我要请求你的一个数据，请把数据给我，给我之后调用我的 xxx 然后把参数传到 xxx 的第一个参数里面：异步
    } /* JSON + padding = JSONP  */
     /* string + padding = stringp */
    response.end()
  } else{
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write('呜呜呜')
    response.end()
  }

  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)
