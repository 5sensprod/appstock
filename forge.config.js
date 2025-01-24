// forge.config.js

module.exports = {
  packagerConfig: {
    asar: false,
    extraResource: [
      './node_modules/serialport',
      './node_modules/@serialport',
      './node_modules/debug',
      './node_modules/ms',
      './node_modules/node-gyp-build', // Inclure le dossier node-gyp-build
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'appstock',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
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
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: '5sensprod',
          name: 'appstock',
        },
        prerelease: false,
      },
    },
  ],
  hooks: {
    packageAfterCopy: async (
      config,
      buildPath,
      electronVersion,
      platform,
      arch,
    ) => {
      const fs = require('fs-extra')
      const path = require('path')

      // Copie de 'serialport'
      const serialportSourceDir = path.join(
        __dirname,
        'node_modules',
        'serialport',
      )
      const serialportDestDir = path.join(
        buildPath,
        'node_modules',
        'serialport',
      )
      await fs.copy(serialportSourceDir, serialportDestDir)

      // Copie de '@serialport'
      const atSerialportSourceDir = path.join(
        __dirname,
        'node_modules',
        '@serialport',
      )
      const atSerialportDestDir = path.join(
        buildPath,
        'node_modules',
        '@serialport',
      )
      await fs.copy(atSerialportSourceDir, atSerialportDestDir)

      // Copie de 'debug'
      const debugSourceDir = path.join(__dirname, 'node_modules', 'debug')
      const debugDestDir = path.join(buildPath, 'node_modules', 'debug')
      await fs.copy(debugSourceDir, debugDestDir)

      // Copie de 'ms'
      const msSourceDir = path.join(__dirname, 'node_modules', 'ms')
      const msDestDir = path.join(buildPath, 'node_modules', 'ms')
      await fs.copy(msSourceDir, msDestDir)

      // Copie de 'node-gyp-build'
      const nodeGypSourceDir = path.join(
        __dirname,
        'node_modules',
        'node-gyp-build',
      )
      const nodeGypDestDir = path.join(
        buildPath,
        'node_modules',
        'node-gyp-build',
      )
      await fs.copy(nodeGypSourceDir, nodeGypDestDir)
    },
  },
}
