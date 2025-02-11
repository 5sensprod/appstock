//src\server\services\WebSocketService.js

const WebSocket = require('ws')

class WebSocketService {
  initialize(server) {
    this.wss = new WebSocket.Server({ server })
    this.setupEventHandlers()
  }

  setupEventHandlers() {
    this.wss.on('connection', (ws) => {
      console.log('Client WebSocket connecté')

      ws.on('message', (message) => this.handleMessage(ws, message))
      ws.on('close', () => this.handleDisconnection())
    })
  }

  handleMessage(ws, message) {
    console.log('received: %s', message)
    this.broadcast(message, ws)
  }

  broadcast(message, excludeWs) {
    this.wss.clients.forEach((client) => {
      if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
  }

  handleDisconnection() {
    console.log('Client WebSocket déconnecté')
  }
}

module.exports = new WebSocketService()
