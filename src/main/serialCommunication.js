const { SerialPort } = require('serialport')
const { removeAccents, formatLcdMessage } = require('./lcdUtils')

let port

function initializeSerialPort() {
  port = new SerialPort({
    path: 'COM10',
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
    console.log('Port série ouvert sur COM10')

    // Envoi de la commande pour effacer l'écran
    const clearCommand = Buffer.from([0x0c]) // Commande pour effacer l'écran

    port.write(clearCommand, function (err) {
      if (err) {
        return console.log(
          "Erreur lors de l'envoi de la commande d'effacement : ",
          err.message,
        )
      }
      console.log("Commande d'effacement envoyée à l'écran LCD")

      // Attendre un court instant pour que l'écran ait le temps de se nettoyer
      setTimeout(() => {
        const message = 'AXE MUSIQUE \r\nBIENVENUE'
        port.write(message, function (err) {
          if (err) {
            return console.log(
              "Erreur lors de l'écriture sur le port série : ",
              err.message,
            )
          }
          console.log("Message envoyé à l'écran LCD : ", message)
        })
      }, 100) // Délai de 100ms
    })
  })
}

function sendToLcd(data) {
  if (port && port.isOpen) {
    const message = formatLcdMessage(data)
    console.log("Message formaté pour l'écran LCD:", message)

    const clearCommand = Buffer.from([0x0c]) // Commande pour effacer l'écran
    port.write(clearCommand, function (err) {
      if (err) {
        return console.log(
          "Erreur lors de l'envoi de la commande d'effacement : ",
          err.message,
        )
      }
      // Attendre un court instant avant d'envoyer le message
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
      }, 100) // Délai de 100ms
    })
  } else {
    console.log("Le port série n'est pas ouvert.")
  }
}

module.exports = {
  initializeSerialPort,
  sendToLcd,
}
