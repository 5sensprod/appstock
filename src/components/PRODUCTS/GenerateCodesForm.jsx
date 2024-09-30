import React, { useState } from 'react'
import {
  Button,
  FormControlLabel,
  FormGroup,
  Typography,
  Grid,
  RadioGroup,
  Radio,
  TextField,
} from '@mui/material'

const GenerateCodesForm = ({ onSubmit, onCancel }) => {
  const [codeType, setCodeType] = useState('barcode') // 'barcode' ou 'qrcode'
  const [height, setHeight] = useState(50) // Hauteur par défaut en mm

  const handleCodeTypeChange = (event) => {
    setCodeType(event.target.value)
  }

  const handleHeightChange = (event) => {
    setHeight(event.target.value)
  }

  const handleSubmit = () => {
    onSubmit({ codeType, height })
  }

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Options de génération des codes
      </Typography>

      <FormGroup>
        <RadioGroup
          row
          value={codeType}
          onChange={handleCodeTypeChange}
          name="codeType"
        >
          <FormControlLabel
            value="barcode"
            control={<Radio />}
            label="Code-barres"
          />
          <FormControlLabel
            value="qrcode"
            control={<Radio />}
            label="QR Code"
          />
        </RadioGroup>

        <TextField
          label="Hauteur des images (mm)"
          type="number"
          value={height}
          onChange={handleHeightChange}
          inputProps={{ min: 10 }}
          style={{ marginTop: 16 }}
        />
      </FormGroup>

      <Grid container spacing={2} style={{ marginTop: 16 }}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Générer
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="secondary" onClick={onCancel}>
            Annuler
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default GenerateCodesForm
