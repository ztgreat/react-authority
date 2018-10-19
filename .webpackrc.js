const path = require('path');

export default {
  entry: './src/index.js',
  extraBabelPlugins: [
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
  ],
  html: {
    template: './src/index.ejs',
  },
  publicPath: "/",
  proxy: {
    '/api': {
      target:"http://127.0.0.1:8080",
      changeOrigin:true,
      secure: false,
      /*pathRewrite:{
        "^/api":""
      }*/

    },
  },
};
