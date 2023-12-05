import { useEffect } from 'react'

const useGlobalScannedDataHandler = (setSearchTerm) => {
  useEffect(() => {
    window.handleScannedData = (scannedData) => {
      setSearchTerm(scannedData)
    }

    return () => {
      delete window.handleScannedData
    }
  }, [setSearchTerm])
}

export default useGlobalScannedDataHandler
