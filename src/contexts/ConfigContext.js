import React, { createContext, useContext, useState, useEffect } from 'react'
import { getApiBaseUrl } from '../api/axiosConfig'

const ConfigContext = createContext()

export const ConfigProvider = ({ children }) => {
  const [baseUrl, setBaseUrl] = useState('')
  const [serverReady, setServerReady] = useState(false)

  useEffect(() => {
    getApiBaseUrl().then((url) => {
      setBaseUrl(url.replace('/api', ''))

      // Écouter le statut du serveur via SSE
      const eventSource = new EventSource(`${url}/server-status`)
      eventSource.onmessage = (event) => {
        const { serverReady } = JSON.parse(event.data)
        setServerReady(serverReady) // Mettre à jour l'état avec la valeur reçue
        console.log('Server Ready State:', serverReady) // Afficher l'état dans la console
        if (serverReady) {
          eventSource.close() // Fermer la connexion SSE une fois que le serveur est prêt
        }
      }
    })
  }, [])

  return (
    <ConfigContext.Provider value={{ baseUrl, serverReady, setServerReady }}>
      {children}
    </ConfigContext.Provider>
  )
}

export const useConfig = () => {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error("useConfig doit être utilisé au sein d'un ConfigProvider")
  }
  return context
}
