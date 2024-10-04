// forge.config.js

module.exports = {
  packagerConfig: {
    asar: false,
    extraResource: ['./node_modules/serialport'],
  },
  rebuildConfig: {},
  makers: [
    // Vos configurations de makers
  ],
  plugins: [
    // Plugin-auto-unpack-natives retiré précédemment
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.js',
              name: 'main_window',
              preload: {
                js: './src/preload.js',
              },
            },
          ],
        },
      },
    },
  ],
  publishers: [
    // Vos configurations de publishers
  ],
}
