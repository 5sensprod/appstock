// src/components/woocommerce/WooCommerceConfig.jsx
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from '@mui/material'

const WooCommerceConfig = ({ open, onClose }) => {
  const [config, setConfig] = useState({
    url: '',
    consumerKey: '',
    consumerSecret: '',
  })
  const [status, setStatus] = useState({ type: '', message: '' })

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const currentConfig = await window.electron.woocommerce.getConfig()
        setConfig(currentConfig)
      } catch (error) {
        console.error('Erreur chargement config:', error)
      }
    }
    if (open) {
      loadConfig()
    }
  }, [open])

  const handleSave = async () => {
    try {
      await window.electron.woocommerce.updateConfig(config)
      const testResult = await window.electron.woocommerce.testConnection()
      if (testResult.success) {
        setStatus({
          type: 'success',
          message: 'Configuration sauvegardée et testée avec succès',
        })
        setTimeout(onClose, 1500)
      } else {
        setStatus({ type: 'error', message: testResult.message })
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Configuration WooCommerce</DialogTitle>
      <DialogContent>
        {status.message && (
          <Alert severity={status.type} sx={{ mb: 2 }}>
            {status.message}
          </Alert>
        )}
        <TextField
          fullWidth
          label="URL de la boutique"
          value={config.url}
          onChange={(e) => setConfig({ ...config, url: e.target.value })}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Consumer Key"
          value={config.consumerKey}
          onChange={(e) =>
            setConfig({ ...config, consumerKey: e.target.value })
          }
          margin="normal"
        />
        <TextField
          fullWidth
          label="Consumer Secret"
          value={config.consumerSecret}
          onChange={(e) =>
            setConfig({ ...config, consumerSecret: e.target.value })
          }
          margin="normal"
          type="password"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Sauvegarder
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default WooCommerceConfig
