import React from 'react'
import { Box, Typography } from '@mui/material'

const TotauxTVA = ({ data }) => {
  // Grouper les articles par taux de TVA et additionner les valeurs
  const totauxParTVA = data.items.reduce((acc, item) => {
    const { tauxTVA, montantTVA, puHT, quantite } = item
    const totalHT = puHT * quantite
    const totalTVA = montantTVA * quantite
    const tauxKey = `Tx TVA ${tauxTVA}%`

    if (!acc[tauxKey]) {
      acc[tauxKey] = { totalHT: 0, montantTVA: 0, totalTTC: 0 }
    }

    acc[tauxKey].totalHT += totalHT
    acc[tauxKey].montantTVA += totalTVA
    acc[tauxKey].totalTTC += totalHT + totalTVA
    return acc
  }, {})

  let totalHT = 0
  let totalTVA = 0
  let totalTTC = 0

  Object.values(totauxParTVA).forEach((totals) => {
    totalHT += totals.totalHT
    totalTVA += totals.montantTVA
    totalTTC += totals.totalTTC
  })

  return (
    <Box>
      {/* En-têtes de colonne */}
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2}>
        <Typography
          sx={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'left' }}
        >
          Tx TVA
        </Typography>
        <Typography
          sx={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'left' }}
        >
          HT
        </Typography>
        <Typography
          sx={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'left' }}
        >
          TVA
        </Typography>
        <Typography
          sx={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'left' }}
        >
          TTC
        </Typography>
      </Box>

      {/* Valeurs pour chaque taux de TVA */}
      {Object.entries(totauxParTVA).map(([taux, totals]) => (
        <Box
          key={taux}
          display="grid"
          gridTemplateColumns="repeat(4, 1fr)"
          gap={2}
        >
          {/* Afficher le taux de TVA */}
          <Typography sx={{ fontSize: '10px', textAlign: 'left' }}>
            {taux.replace('Tx TVA ', '')}
          </Typography>
          {/* Afficher les totaux pour HT, TVA, et TTC */}
          <Typography sx={{ fontSize: '10px', textAlign: 'left' }}>
            {totals.totalHT.toFixed(2)}
          </Typography>
          <Typography sx={{ fontSize: '10px', textAlign: 'left' }}>
            {totals.montantTVA.toFixed(2)}
          </Typography>
          <Typography sx={{ fontSize: '10px', textAlign: 'left' }}>
            {totals.totalTTC.toFixed(2)}
          </Typography>
        </Box>
      ))}
      {/* Totals généraux */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(4, 1fr)"
        gap={2}
        sx={{ mt: 2, borderTop: '1px dashed black', pt: 1 }}
      >
        <Typography
          sx={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'left' }}
        >
          TOTAUX
        </Typography>
        <Typography sx={{ fontSize: '10px', textAlign: 'left' }}>
          {totalHT.toFixed(2)}
        </Typography>
        <Typography sx={{ fontSize: '10px', textAlign: 'left' }}>
          {totalTVA.toFixed(2)}
        </Typography>
        <Typography sx={{ fontSize: '10px', textAlign: 'left' }}>
          {totalTTC.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  )
}

export default TotauxTVA
