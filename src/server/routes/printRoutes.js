const express = require('express')
const router = express.Router()
const electron = require('electron')
const { BrowserWindow } = electron

// Route pour imprimer du contenu HTML
router.post('/', (req, res) => {
  const content = req.body.content
  let win = new BrowserWindow({
    show: false,
    webPreferences: { offscreen: true },
  })

  console.log(`Chargement du contenu: ${encodeURI(content)}`)
  win.loadURL(`data:text/html;charset=utf-8,${encodeURI(content)}`)

  win.webContents.on('did-finish-load', async () => {
    const printers = await win.webContents.getPrintersAsync()
    const posPrinter = printers.find((printer) =>
      printer.name.includes('EPSON XP-212 213 Series'),
    )

    if (posPrinter) {
      const printOptions = {
        deviceName: posPrinter.name,
        color: false,
        margins: { marginType: 'custom', top: 0, bottom: 0, left: 0, right: 0 },
        landscape: false,
        silent: true,
        pageSize: { width: 314961, height: 600000 },
        scaleFactor: 233,
      }

      win.webContents.print(printOptions, (success, errorType) => {
        console.log(
          `Tentative d'impression: ${success ? 'Réussie' : 'Échouée'}`,
        )
        if (!success) {
          console.error(`Erreur d'impression: ${errorType}`)
          res.status(500).send("Erreur lors de l'impression")
        } else {
          console.log('Impression réussie !')
          res.send('Impression réussie !')
        }
        win.destroy()
      })
    } else {
      console.error('Imprimante EPSON XP-212 213 Series non trouvée.')
      res.status(404).send('Imprimante non trouvée.')
    }
  })
})

module.exports = router
