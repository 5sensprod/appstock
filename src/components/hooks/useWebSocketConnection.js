import { useState, useCallback, useEffect } from 'react'
import useWebSocket from './useWebSocket'
import { isRunningInElectron, fetchApi } from '../../api/axiosConfig'
import { useProductContext } from '../../contexts/ProductContext'

const useWebSocketConnection = () => {
  const { setSearchTerm, baseUrl } = useProductContext()
  const [wsUrl, setWsUrl] = useState('')

  useEffect(() => {
    const updateWsUrl = (url) => {
      setWsUrl(url)
    }

    if (isRunningInElectron()) {
      const wsBaseUrl = baseUrl.replace(/^http/, 'ws').replace('/api', '')
      updateWsUrl(wsBaseUrl)
    } else {
      fetchApi('getLocalIp')
        .then((data) => {
          const newWsUrl = `ws://${data.ip}:5000`
          updateWsUrl(newWsUrl)
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération de l'IP:", error)
        })
    }
  }, [baseUrl])

  // Gestion des événements WebSocket
  const handleWsMessage = useCallback(
    (event) => {
      if (event.data instanceof Blob) {
        const reader = new FileReader()
        reader.onload = () => setSearchTerm(reader.result)
        reader.onerror = (error) =>
          console.error('Erreur lors de la lecture du Blob:', error)
        reader.readAsText(event.data)
      } else {
        setSearchTerm(event.data)
      }
    },
    [setSearchTerm],
  )

  const handleWsOpen = useCallback(() => {
    console.log('Connexion WebSocket établie')
  }, [])

  const handleWsError = useCallback((error) => {
    console.error('Erreur WebSocket:', error)
  }, [])

  const handleWsClose = useCallback(() => {
    console.log('Connexion WebSocket fermée')
  }, [])

  // Utilisation du hook useWebSocket
  useWebSocket(
    wsUrl,
    handleWsMessage,
    handleWsError,
    handleWsOpen,
    handleWsClose,
  )

  return { setWsUrl }
}

export default useWebSocketConnection
