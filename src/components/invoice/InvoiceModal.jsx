import React, { useContext } from 'react'
import { Modal, Paper, Typography, Box } from '@mui/material'
import { CartContext } from '../../contexts/CartContext'
import PrintableInvoice from './PrintableInvoice'
import SimplePrintComponent from './SimplePrintComponent'

const InvoiceModal = () => {
  const { isModalOpen, setIsModalOpen, invoiceData } = useContext(CartContext)

  return (
    <Modal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
        }}
      >
        <Typography id="modal-modal-title" variant="body2" component="h2">
          La facture a été enregistrée avec succès.
        </Typography>
        <Box my={1}>
          <SimplePrintComponent />
        </Box>
        <Box my={1}>
          {invoiceData && <PrintableInvoice invoiceData={invoiceData} />}
        </Box>
      </Paper>
    </Modal>
  )
}

export default InvoiceModal
