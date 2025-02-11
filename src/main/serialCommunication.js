const { SerialPort } = require('serialport')
const { formatLcdMessage } = require('./lcdUtils')

let port

function initializeSerialPort(selectedPort = 'COM3') {
  // Fermer le port série actuel s'il est ouvert
  if (port && port.isOpen) {
    port.close((err) => {
      if (err) {
        console.log('Erreur lors de la fermeture du port série :', err.message)
      } else {
        console.log('Port série fermé avec succès.')
        openPort(selectedPort) // Ouvre le nouveau port après avoir fermé l'ancien
      }
    })
  } else {
    openPort(selectedPort) // Ouvre directement le port si aucun port n'est ouvert
  }
}

function openPort(selectedPort) {
  port = new SerialPort({
    path: selectedPort,
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    autoOpen: false,
  })

  port.on('error', function (err) {
    console.log('Erreur du port série : ', err.message)
  })

  port.open(function (err) {
    if (err) {
      return console.log("Erreur lors de l'ouverture du port : ", err.message)
    }
    console.log(`Port série ouvert sur ${selectedPort}`)
  })
}

function sendToLcd(data) {
  if (port && port.isOpen) {
    const message = formatLcdMessage(data)
    console.log("Message formaté pour l'écran LCD:", message)

    const clearCommand = Buffer.from([0x0c])
    port.write(clearCommand, function (err) {
      if (err) {
        return console.log(
          "Erreur lors de l'envoi de la commande d'effacement : ",
          err.message,
        )
      }
      setTimeout(() => {
        port.write(message, function (err) {
          if (err) {
            return console.log(
              "Erreur lors de l'écriture sur le port série : ",
              err.message,
            )
          }
          console.log("Message envoyé à l'écran LCD : ", message)
        })
      }, 100)
    })
  } else {
    console.log("Le port série n'est pas ouvert.")
  }
}

module.exports = {
  initializeSerialPort,
  sendToLcd,
}
