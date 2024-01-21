import React, { useEffect } from 'react'
import { triggerBackup, getPaths } from '../../ipcHelper'

const BackupComponent = () => {
  useEffect(() => {
    // Vous pouvez placer ici d'autres logiques d'initialisation si nécessaire
    getPaths().then((paths) => {
      if (!paths) {
        console.log('Les chemins ne sont pas disponibles.')
      }
      // Vous pouvez également utiliser les chemins ici pour d'autres opérations
    })
  }, [])

  const handleBackup = async () => {
    try {
      const response = await triggerBackup()
      alert('Sauvegarde réussie ')
    } catch (error) {
      console.error('Échec de la sauvegarde:', error)
      alert('Échec de la sauvegarde: ' + error.message)
    }
  }

  return (
    <div>
      <button onClick={handleBackup}>Déclencher la Sauvegarde</button>
    </div>
  )
}

export default BackupComponent
