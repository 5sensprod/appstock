import { useEffect } from 'react'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'

const useGlobalScannedDataHandler = () => {
  const { setSearchTerm } = useProductContextSimplified()

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
