import { useEffect } from 'react'
import { useProductContext } from '../../contexts/ProductContext'

const useGlobalScannedDataHandler = () => {
  const { setSearchTerm } = useProductContext()

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
