import React from 'react'
import { TextField, Button, Box } from '@mui/material' // Importez les composants nécessaires depuis MUI

const EditUser = ({ userInfo, onChange, onSubmit, onCancel }) => {
  return (
    <form onSubmit={onSubmit}>
      <Box mt={2} sx={{ '& > div': { marginBottom: 2 } }}>
        <TextField
          label="Nom"
          type="text"
          name="name"
          value={userInfo.name || ''}
          onChange={onChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Adresse"
          type="text"
          name="address"
          value={userInfo.address || ''}
          onChange={onChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Ville"
          type="text"
          name="city"
          value={userInfo.city || ''}
          onChange={onChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Email"
          type="text"
          name="email"
          value={userInfo.email || ''}
          onChange={onChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Téléphone"
          type="text"
          name="phone"
          value={userInfo.phone || ''}
          onChange={onChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Numéro d'identification fiscale"
          type="text"
          name="taxId"
          value={userInfo.taxId || ''}
          onChange={onChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="RCS"
          type="text"
          name="rcs"
          value={userInfo.rcs || ''}
          onChange={onChange}
          fullWidth
          variant="outlined"
        />
      </Box>
      <Button variant="contained" type="submit" sx={{ mr: 2 }}>
        Enregistrer
      </Button>
      <Button variant="outlined" onClick={onCancel}>
        Annuler
      </Button>
    </form>
  )
}

export default EditUser
