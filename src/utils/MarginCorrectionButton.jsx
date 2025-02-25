import React, { useState } from 'react'
import { Button, Snackbar, Alert, CircularProgress } from '@mui/material'
import { fetchApi } from '../api/axiosConfig'

const MarginCorrectionButton = () => {
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  })

  const handleCorrectMargins = async () => {
    try {
      setLoading(true)
      const response = await fetchApi('products/correct-margins', 'POST')

      setSnackbar({
        open: true,
        message: `Succès! ${response.updatedCount} produits mis à jour.`,
        severity: 'success',
      })
    } catch (error) {
      console.error('Erreur lors de la correction des marges:', error)
      setSnackbar({
        open: true,
        message: `Erreur: ${error.response?.data?.error || error.message}`,
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCorrectMargins}
        disabled={loading}
        startIcon={
          loading ? <CircularProgress size={20} color="inherit" /> : null
        }
        sx={{ mb: 2 }}
      >
        {loading ? 'Correction en cours...' : 'Corriger les marges'}
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default MarginCorrectionButton
