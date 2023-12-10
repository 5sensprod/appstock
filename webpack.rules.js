module.exports = [
  // ... vos autres règles existantes
  {
    test: /native_modules[/\\].+\.node$/,
    use: 'node-loader',
  },
  {
    test: /\.jsx?$/,
    use: {
      loader: 'babel-loader',
      options: {
        exclude: /node_modules/,
        presets: ['@babel/preset-react'],
      },
    },
  },
  // Ajout d'une règle pour les fichiers d'image
  {
    test: /\.(png|jpe?g|gif)$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
          // Vous pouvez spécifier des options ici
          name: '[path][name].[ext]',
        },
      },
    ],
  },
]
