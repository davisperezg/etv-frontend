const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  //realizar proxy inverso en el server
  app.use(
    createProxyMiddleware("/countrys", {
      target: "https://flagcdn.com/es/codes.json",
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        "^/countrys": "",
      },
    })
  );
  app.use(
    createProxyMiddleware("/country/img", {
      target: "https://flagcdn.com",
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        "^/country/img": "",
      },
    })
  );
};
