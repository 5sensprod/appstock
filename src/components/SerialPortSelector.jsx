import React, { useState, useEffect } from 'react'
import { useConfig } from '../contexts/ConfigContext'

const SerialPortSelector = () => {
  const { selectedPort, setSelectedPort } = useConfig()
  const [availablePorts, setAvailablePorts] = useState([])

  useEffect(() => {
    // Appel à l'API pour obtenir les ports disponibles
    if (window.electron) {
      window.electron.ipcRenderer.invoke('get-serial-ports').then((ports) => {
        setAvailablePorts(ports)
      })
    }
  }, [])

  const handlePortChange = (event) => {
    const port = event.target.value
    setSelectedPort(port) // Mettre à jour le port sélectionné dans le contexte
    if (window.electron) {
      window.electron.ipcRenderer.send('set-serial-port', port) // Envoyer la mise à jour du port série à Electron
    }
  }

  return (
    <div>
      <label htmlFor="port-select">Choisir un port COM : </label>
      <select id="port-select" value={selectedPort} onChange={handlePortChange}>
        <option value="" disabled>
          Sélectionner un port
        </option>
        {availablePorts.map((port) => (
          <option key={port} value={port}>
            {port}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SerialPortSelector
