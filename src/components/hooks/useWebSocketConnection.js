import { useState, useCallback, useEffect } from 'react'
import useWebSocket from './useWebSocket'
import { isRunningInElectron, fetchApi } from '../../api/axiosConfig'
import { useProductContext } from '../../contexts/ProductContext'
import { useConfig } from '../../contexts/ConfigContext'

const useWebSocketConnection = () => {
  const { setSearchTerm } = useProductContext()
  const { baseUrl } = useConfig()
  const [wsUrl, setWsUrl] = useState('')
  const [isServerReady, setIsServerReady] = useState(false) // Ajout de cet état

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const data = await fetchApi('serverStatus') // Notez que c'est 'serverStatus', pas '/api/serverStatus'
        if (data.status === 'ready') {
          setIsServerReady(true) // Serveur prêt, on peut établir la connexion WebSocket
        } else {
          // Si le serveur n'est pas prêt, retenter après un délai
          setTimeout(checkServerStatus, 2000)
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de l'état du serveur:",
          error,
        )
        setTimeout(checkServerStatus, 2000)
      }
    }

    checkServerStatus()
  }, [])

  useEffect(() => {
    if (!isServerReady) {
      return // Ne pas essayer de se connecter tant que le serveur n'est pas prêt
    }

    const updateWsUrl = () => {
      if (isRunningInElectron()) {
        const wsBaseUrl = baseUrl.replace(/^http/, 'ws').replace('/api', '')
        setWsUrl(wsBaseUrl)
      } else {
        fetchApi('getLocalIp')
          .then((data) => {
            const newWsUrl = `ws://${data.ip}:5000`
            setWsUrl(newWsUrl)
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération de l'IP:", error)
          })
      }
    }

    updateWsUrl()
  }, [baseUrl, isServerReady])

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
