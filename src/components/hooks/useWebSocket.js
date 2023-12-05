import { useEffect, useRef } from 'react'

const useWebSocket = (url, onMessage, onError, onOpen, onClose) => {
  const ws = useRef(null)

  useEffect(() => {
    // Fermer la connexion WebSocket existante si l'URL change
    if (ws.current) {
      ws.current.close()
    }

    // Ne rien faire si l'URL est vide ou nulle
    if (!url) return

    ws.current = new WebSocket(url)
    ws.current.onmessage = onMessage
    ws.current.onerror = onError
    ws.current.onopen = onOpen
    ws.current.onclose = onClose

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [url, onMessage, onError, onOpen, onClose])

  return ws.current
}

export default useWebSocket
