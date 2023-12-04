import React, { useState, useEffect } from 'react'

const MyComponent = () => {
  const [localIP, setLocalIP] = useState('')

  useEffect(() => {
    window.electronAPI
      .getLocalIPv4Address()
      .then((ip) => {
        setLocalIP(ip)
      })
      .catch((err) => {
        console.error(
          "Erreur lors de la récupération de l'adresse IP locale:",
          err,
        )
        setLocalIP('Non disponible')
      })
  }, [])

  return <div>Hello from MyComponent. Local IP: {localIP}</div>
}

export default MyComponent
