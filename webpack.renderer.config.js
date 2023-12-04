const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  devtool: false,
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
