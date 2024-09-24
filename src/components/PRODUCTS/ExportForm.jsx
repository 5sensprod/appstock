import React, { useState } from 'react'
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Grid,
} from '@mui/material'

const ExportForm = ({ onSubmit, onCancel, availableFields }) => {
  const [selectedFields, setSelectedFields] = useState(() => {
    const initialFields = {}
    for (const field in availableFields) {
      initialFields[field] = true // Par défaut, tous les champs sont sélectionnés
    }
    return initialFields
  })

  const [exportFormat, setExportFormat] = useState({
    csv: true,
    pdf: false,
  })

  const handleFieldChange = (event) => {
    setSelectedFields({
      ...selectedFields,
      [event.target.name]: event.target.checked,
    })
  }

  const handleFormatChange = (event) => {
    setExportFormat({
      ...exportFormat,
      [event.target.name]: event.target.checked,
    })
  }

  const handleSubmit = () => {
    onSubmit({ selectedFields, exportFormat })
  }

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Sélectionnez les champs à exporter
      </Typography>

      <FormGroup>
        {Object.keys(availableFields).map((field) => (
          <FormControlLabel
            key={field}
            control={
              <Checkbox
                checked={selectedFields[field]}
                onChange={handleFieldChange}
                name={field}
              />
            }
            label={availableFields[field]}
          />
        ))}
      </FormGroup>

      <Typography variant="h6" gutterBottom style={{ marginTop: 16 }}>
        Sélectionnez le format d'exportation
      </Typography>

      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={exportFormat.csv}
              onChange={handleFormatChange}
              name="csv"
            />
          }
          label="CSV"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={exportFormat.pdf}
              onChange={handleFormatChange}
              name="pdf"
            />
          }
          label="PDF"
        />
      </FormGroup>

      <Grid container spacing={2} style={{ marginTop: 16 }}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Exporter
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

export default ExportForm
