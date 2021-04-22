const IP = require('./ipconfig')
module.exports = {
  proxy: {
    '/apis': {
        target: IP,
        secure: false,
        changeOrigin: true,
        pathRewrite: {
            '^/apis': '/yyh41-fg/api'
        },
        onProxyRes(proxyRes, req, res) {
            var cookies = proxyRes.headers['set-cookie']
            if (cookies == null || cookies.length == 0) {
                delete proxyRes.headers['set-cookie']
                return
            }
            for (var i = 0,n = cookies.length; i < n; i++) {
                if(cookies[i].match(/^JSESSIONID=[^;]+;[\s\S]*Path=\/[^;]+/)){
                    cookies[i] = cookies[i].replace(/Path=\/[^;]+/,'Path=/');
                }
            }
            proxyRes.headers['set-cookie'] = cookies;
        }
    },
    historyApiFallback: true
  }
}
