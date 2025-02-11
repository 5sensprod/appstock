//src\server\services\SSEService.js
class SSEService {
  constructor() {
    this.clients = new Map()
  }

  handleConnection(req, res) {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const clientId = Date.now()
    const newClient = { id: clientId, res }
    this.clients.set(clientId, newClient)

    req.on('close', () => {
      console.log(`Client ${clientId} déconnecté`)
      this.clients.delete(clientId)
    })
  }

  broadcast(data) {
    this.clients.forEach((client) => {
      client.res.write(`data: ${JSON.stringify(data)}\n\n`)
    })
  }
}

module.exports = new SSEService()
