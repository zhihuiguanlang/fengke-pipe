// 使用koa
const koa = require('koa')
const router = require('koa-router')()
// koa-websocket是koa封装好的websocket功能
const websocket = require('koa-websocket')
// 实例化一个ws服务
const app = websocket(new koa())
Stream = require('node-rtsp-stream')

// 用来存储建立了的链接，
let wsObj = {}
let array = new Array();

// 监听koa/ws路由，是否有连接
router.all('/', (ctx) => {
  // 客户端链接传过来的客户端身份
  const {streamUrl } = ctx.query
 console.log("------streamUrl:",streamUrl)
  // 生成一个不重复的端口号
  let port = generateRandom();
  ctx.query.port=port;

  ctx.websocket.send(port)
  wsObj[port] = { "port": port };

  stream = new Stream({
    name: 'name',
    streamUrl: streamUrl,
    wsPort: port,
    ffmpegOptions: { // options ffmpeg flags
      '-stats': '', // an option with no neccessary value uses a blank string
      '-r': 30 // options with required values specify the value after the key
    }
  })
  wsObj[port].stream = stream;

  // 监听客户端发送过来的信息
  ctx.websocket.on('message', function (message) {
    var mes = JSON.parse(message)
    if (mes.method === "stop") {
      wsObj[mes.port].stream.stop();
      array.remove(wsObj[mes.port].port)
    }
    ctx.websocket.send(JSON.stringify(mes))
  });

  ctx.websocket.on('close', function (e) {
      wsObj[ctx.query.port].stream.stop();
      array.remove(wsObj[ctx.query.port].port)
  
    console.log("客户端连接关闭")
  })
})
// 使用路由
app.ws.use(router.routes()).use(router.allowedMethods())


//端口号后面可采用动态的
app.listen(3100, () =>
  console.log('服务启动成功')
)



// 生成随机数的方法
function generateRandom() {
  var rand = parseInt(Math.round(Math.random() * 700 + 4000));
  for (var i = 0; i < array.length; i++) {
    if (array.contains(rand)) {
      generateRandom();
    }
  }
  array.push(rand);
  return rand;

}
//判断值是否在数组里
Array.prototype.contains = function (obj) {
  var index = this.length;
  while (index--) {
    if (this[index] === obj) {
      return true;
    }
  }
  return false;
}
//删除数组指定的某个元素
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
