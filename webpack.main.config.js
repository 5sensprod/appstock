const path = require('path')

module.exports = {
  entry: './src/main.js',
  target: 'electron-main', // Ajout de la cible
  devtool: false,
  module: {
    rules: require('./webpack.rules'),
  },
  externals: {
    serialport: 'commonjs2 serialport', // Exclure serialport du bundling
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  // Optionnel : Spécifier l'endroit où placer le bundle
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '.webpack'),
  },
}
