import React, { useEffect } from 'react'
import { triggerDirectExport, getPaths } from '../../ipcHelper'

const BackupComponent = () => {
  useEffect(() => {
    // Vous pouvez placer ici d'autres logiques d'initialisation si nécessaire
    getPaths().then((paths) => {
      if (!paths) {
        console.log('Les chemins ne sont pas disponibles.')
      }
    })
  }, [])

  const handleExport = async () => {
    try {
      const response = await triggerDirectExport()
      alert('Exportation réussie')
    } catch (error) {
      console.error("Échec de l'exportation:", error)
      alert("Échec de l'exportation: " + error.message)
    }
  }

  return (
    <div>
      <button onClick={handleExport}>Déclencher la Sauvegarde</button>
    </div>
  )
}

export default BackupComponent
