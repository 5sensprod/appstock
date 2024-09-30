const { BrowserWindow } = require('electron')

async function printContent(content) {
  let win = new BrowserWindow({ show: false })
  win.loadURL('data:text/html;charset=utf-8,' + encodeURI(content))

  win.webContents.on('did-finish-load', async () => {
    const printers = await win.webContents.getPrintersAsync()
    const posPrinter = printers.find((printer) =>
      printer.name.includes('POS-80'),
    )

    if (posPrinter) {
      const printOptions = {
        deviceName: posPrinter.name,
        color: false,
        margins: {
          marginType: 'custom',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
        landscape: false,
        silent: false,
        pageSize: {
          width: 314961,
          height: 600000,
        },
        scaleFactor: 233,
      }

      win.webContents.print(printOptions, (success, errorType) => {
        if (!success) console.log(`Erreur d'impression: ${errorType}`)
        else console.log('Impression réussie !')
        win.destroy()
      })
    } else {
      console.log(
        "Imprimante POS-80 non trouvée. Vérifiez que l'imprimante est correctement connectée et réessayez.",
      )
      win.destroy()
    }
  })
}

module.exports = {
  printContent,
}
