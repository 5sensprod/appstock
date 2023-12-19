import React, { useRef, useContext } from 'react'
import { Button } from '@mui/material'
import ReactToPrint from 'react-to-print'
import { CartContext } from '../../contexts/CartContext'
import PrintComponent from './PrintComponent' // Assurez-vous que le chemin est correct

const SimplePrintComponent = () => {
  const printRef = useRef()
  const { invoiceData } = useContext(CartContext)

  return (
    <div>
      <ReactToPrint
        trigger={() => <Button variant="contained">Imprimer</Button>}
        content={() => printRef.current}
      />
      <div style={{ display: 'none' }}>
        <PrintComponent ref={printRef} invoiceData={invoiceData} />
      </div>
    </div>
  )
}

export default SimplePrintComponent
