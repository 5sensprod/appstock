import { useEffect, useRef, useCallback } from 'react'

const useColumnAutoSize = (autoSizeStrategy) => {
  const gridApi = useRef(null)

  const onGridReady = useCallback(
    (params) => {
      gridApi.current = params.api
      if (autoSizeStrategy.type === 'fitGridWidth') {
        setTimeout(() => params.api.sizeColumnsToFit(), 100)
      }

      // Gérer le redimensionnement de la fenêtre si nécessaire
      const resizeListener = () => {
        if (autoSizeStrategy.type === 'fitGridWidth') {
          setTimeout(() => params.api.sizeColumnsToFit(), 100)
        }
      }
      window.addEventListener('resize', resizeListener)

      return () => {
        window.removeEventListener('resize', resizeListener)
      }
    },
    [autoSizeStrategy],
  )

  const onFirstDataRendered = useCallback(
    (params) => {
      if (autoSizeStrategy.type === 'fitGridWidth') {
        const allColumnIds = params.columnApi
          .getAllColumns()
          .map((column) => column.colId)
        params.columnApi.autoSizeColumns(allColumnIds)
      }
    },
    [autoSizeStrategy],
  )

  return { onGridReady, onFirstDataRendered, gridApi }
}

export default useColumnAutoSize
