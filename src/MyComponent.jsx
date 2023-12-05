import React, { useState, useEffect } from 'react'
import { fetchApi } from './api/axiosConfig' // Assurez-vous que le chemin est correct

const MyComponent = () => {
  const [localIp, setLocalIp] = useState('')

  useEffect(() => {
    fetchApi('getLocalIp') // Assurez-vous que 'getLocalIp' est un endpoint valide de votre API
      .then((data) => {
        setLocalIp(data.ip)
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération de l'IP:", error)
      })
  }, [])

  return <div>Adresse IP locale: {localIp}</div>
}

export default MyComponent
