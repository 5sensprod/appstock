const WebSocket = require('ws')

function initializeWebSocket(server) {
  const wss = new WebSocket.Server({ server })

  wss.on('connection', (ws) => {
    console.log('Client WebSocket connecté')

    ws.on('message', function incoming(message) {
      console.log('received: %s', message)
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message)
        }
      })
    })

    ws.on('close', () => {
      console.log('Client WebSocket déconnecté')
    })
  })
}

module.exports = initializeWebSocket
