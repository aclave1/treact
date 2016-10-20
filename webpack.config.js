var webpack = require('webpack');
var path = require('path');
var examplePath = path.join(__dirname,'example');

module.exports = {
  context: __dirname,
  entry: {
    'example':'./example/example.js',
  },
  output: {
    path: examplePath,
    filename: '[name].bundle.js',
  },
  
  module:{
    loaders:[
      {
        test:/\.js$/,
        exclude:/node_modules/,
        loader:'babel-loader',
        query:{
          presets:['es2015','react','stage-2'],
        }
      }
    ],
    noParse:[
      /\.min\.js$/
    ]
  },
  //devtool:'#inline-source-map' //enable this if you want to debug es6 code
};