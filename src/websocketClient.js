// src/websocketClient.js
import { getLocalIp } from './ipcHelper' // Import de la fonction getLocalIp
import { isRunningInElectron } from './utils/environmentUtils' // Import de la fonction isRunningInElectron

let websocket = null
let reconnectInterval = 5000 // Intervalle de reconnexion en cas de déconnexion
let serverUrl = ''
let messageQueue = [] // File d'attente pour les messages à envoyer quand la connexion est établie
let isWebSocketOpen = false // Nouveau flag pour vérifier l'état de la connexion

export const initializeWebSocket = async (onMessageCallback) => {
  try {
    // Obtenez l'URL du serveur WebSocket en fonction de l'environnement (Electron ou navigateur)
    serverUrl = await getWebSocketBaseUrl()

    // Utilise l'objet WebSocket natif du navigateur pour le processus de rendu (Electron inclus)
    websocket = new WebSocket(serverUrl)

    websocket.onopen = () => {
      console.log('WebSocket client connected to server:', serverUrl)
      isWebSocketOpen = true // Mettre à jour l'état de la connexion

      // Envoyer les messages en attente lorsque la connexion est établie
      while (messageQueue.length > 0) {
        const queuedMessage = messageQueue.shift()
        websocket.send(JSON.stringify(queuedMessage))
        console.log('Message sent from queue:', queuedMessage)
      }
    }

    websocket.onmessage = async (event) => {
      let messageData
      // Vérifiez si les données reçues sont de type Blob
      if (event.data instanceof Blob) {
        // Convertir le Blob en texte
        messageData = await event.data.text()
      } else {
        messageData = event.data
      }

      try {
        const parsedMessage = JSON.parse(messageData) // Analyse des données JSON reçues
        console.log('Message received from server:', parsedMessage)
        if (onMessageCallback && typeof onMessageCallback === 'function') {
          onMessageCallback(parsedMessage) // Propagation du message vers le callback fourni
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
      isWebSocketOpen = false // Mettre à jour l'état de la connexion
      // Reconnexion automatique après un délai défini
      setTimeout(
        () => initializeWebSocket(onMessageCallback),
        reconnectInterval,
      )
    }

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error)
      isWebSocketOpen = false // Mettre à jour l'état de la connexion
      websocket.close() // Ferme la connexion en cas d'erreur pour déclencher une tentative de reconnexion
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
    messageQueue.push(message) // Ajouter le message à la file d'attente s'il n'est pas encore envoyé
  }
}

// Fonction utilitaire pour obtenir l'URL du serveur WebSocket
const getWebSocketBaseUrl = async () => {
  if (isRunningInElectron()) {
    const localIp = await getLocalIp() // Cette fonction est utilisée uniquement si nous sommes dans Electron
    return `ws://${localIp}:5000`
  } else {
    return `ws://localhost:5000` // Pour les navigateurs, nous utilisons simplement localhost
  }
}
