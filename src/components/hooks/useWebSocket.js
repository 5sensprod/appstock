import { useEffect, useRef } from 'react'

const useWebSocket = (url, onMessage, onError, onOpen, onClose) => {
  const ws = useRef(null)

  useEffect(() => {
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
