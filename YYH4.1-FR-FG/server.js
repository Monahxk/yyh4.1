const Koa = require('koa')
const KoaStatic = require('koa-static')

const app = new Koa()

app.use(KoaStatic('./dist'))

app.listen(8899,() => {
  console.log('success')
})