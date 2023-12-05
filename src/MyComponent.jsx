import React, { useState, useEffect } from 'react'

const MyComponent = () => {
  const [localIp, setLocalIp] = useState('')

  useEffect(() => {
    if (window.electron) {
      // Logique spécifique à Electron
      window.electron.receive('localIp', (ip) => {
        setLocalIp(ip)
      })
    } else {
      // Logique pour le navigateur web
      fetch('/api/getLocalIp')
        .then((response) => response.json())
        .then((data) => {
          setLocalIp(data.ip)
        })
        .catch((error) =>
          console.error("Erreur lors de la récupération de l'IP:", error),
        )
    }
  }, [])

  return <div>Adresse IP locale: {localIp}</div>
}

export default MyComponent
