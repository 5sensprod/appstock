// src/websocketClient.js
import axios from 'axios'
import { isRunningInElectron } from './utils/environmentUtils'
import { getLocalIp } from './ipcHelper'
import { displayTotalOnLcd } from './utils/lcdDisplayUtils' // Importer la fonction depuis lcdDisplayUtils

let websocket = null
let reconnectInterval = 5000
let serverUrl = ''
let messageQueue = []
let isWebSocketOpen = false

export const initializeWebSocket = async (onMessageCallback) => {
  try {
    serverUrl = await getWebSocketBaseUrl()
    websocket = new WebSocket(serverUrl)

    websocket.onopen = () => {
      console.log('WebSocket client connected to server:', serverUrl)
      isWebSocketOpen = true

      while (messageQueue.length > 0) {
        const queuedMessage = messageQueue.shift()
        websocket.send(JSON.stringify(queuedMessage))
        console.log('Message sent from queue:', queuedMessage)
      }
    }

    websocket.onmessage = async (event) => {
      let messageData
      if (event.data instanceof Blob) {
        messageData = await event.data.text()
      } else {
        messageData = event.data
      }

      try {
        const parsedMessage = JSON.parse(messageData)
        console.log('Message received from server:', parsedMessage)

        if (parsedMessage.type === 'DISPLAY_TOTAL') {
          displayTotalOnLcd(
            parsedMessage.cartTotals,
            parsedMessage.adjustmentAmount,
          ) // Passer les paramètres requis
        }

        if (onMessageCallback && typeof onMessageCallback === 'function') {
          onMessageCallback(parsedMessage)
        }
      } catch (error) {
        console.error('Error parsing WebSocket message data:', error)
      }
    }

    websocket.onclose = () => {
      console.log(
        'WebSocket connection closed. Attempting to reconnect in',
        reconnectInterval / 1000,
        'seconds',
      )
      isWebSocketOpen = false
      setTimeout(
        () => initializeWebSocket(onMessageCallback),
        reconnectInterval,
      )
    }

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error)
      isWebSocketOpen = false
      websocket.close()
    }
  } catch (error) {
    console.error('Failed to initialize WebSocket:', error)
  }
}

export const sendMessage = (message) => {
  if (isWebSocketOpen && websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.send(JSON.stringify(message))
    console.log('Message sent:', message)
  } else {
    console.warn('WebSocket is not open. Queuing message:', message)
    messageQueue.push(message)
  }
}

// Fonction utilitaire pour obtenir l'URL du serveur WebSocket
const getWebSocketBaseUrl = async () => {
  let localIp = 'localhost'

  if (!isRunningInElectron()) {
    try {
      const response = await axios.get('/api/getLocalIp')
      localIp = response.data.ip || localIp
      console.log('IP locale obtenue pour WebSocket (navigateur) :', localIp)
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'IP du serveur :",
        error,
      )
    }
  } else {
    localIp = await getLocalIp()
    console.log('IP locale obtenue pour WebSocket (Electron) :', localIp)
  }

  return `ws://${localIp}:5000`
}
