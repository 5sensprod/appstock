import React, { useState, useEffect } from 'react'
import { triggerBackup, getPaths } from '../../ipcHelper'

const BackupComponent = () => {
  const [paths, setPaths] = useState(null)

  useEffect(() => {
    const fetchPaths = async () => {
      const fetchedPaths = await getPaths()
      if (fetchedPaths) {
        setPaths(fetchedPaths)
      }
    }

    fetchPaths()
  }, [])

  const handleBackup = async () => {
    if (paths) {
      const response = await triggerBackup(paths.dbPath, paths.backupDir)
      if (response) {
        alert('Sauvegarde réussie: ' + response)
      } else {
        alert('Échec de la sauvegarde')
      }
    } else {
      console.log('Les chemins ne sont pas disponibles.')
    }
  }

  return (
    <div>
      <button onClick={handleBackup} disabled={!paths}>
        Déclencher la Sauvegarde
      </button>
    </div>
  )
}

export default BackupComponent
