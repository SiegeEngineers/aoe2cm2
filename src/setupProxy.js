const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    // package.json proxy field doesn't upgrade websocket properly
    const proxyUrl = 'http://localhost:3000';
    app.use(proxy('/api', { target: proxyUrl, changeOrigin: true }));
    app.use(proxy('/socket.io', { target: proxyUrl, changeOrigin: true, ws: true }));
};