const path = require('path')

module.exports = {
  entry: './src/main.js',
  target: 'electron-main', // Ajout de la cible
  devtool: false,
  module: {
    rules: require('./webpack.rules'),
  },
  externals: {
    serialport: 'commonjs2 serialport',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
}
