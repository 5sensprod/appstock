import React from 'react'
import { Box, Typography } from '@mui/material'

const TotauxTVA = ({ data, fontSize = '10px' }) => {
  // Grouper les articles par taux de TVA et additionner les valeurs
  const totauxParTVA = data.items.reduce((acc, item) => {
    // Récupération ou calcul des valeurs nécessaires
    const tauxTVA = item.tauxTVA
    const quantite = item.quantite || item.quantity
    const puHT = item.puHT || item.prixHT
    const puTTC = item.puTTC || item.prixTTC

    // Calcul de montantTVA si non fourni
    const montantTVA = item.montantTVA || (puTTC - puHT) * quantite

    const tauxKey = `${tauxTVA}%`
    const totalHT = puHT * quantite

    if (!acc[tauxKey]) {
      acc[tauxKey] = { totalHT: 0, montantTVA: 0, totalTTC: 0 }
    }

    acc[tauxKey].totalHT += totalHT
    acc[tauxKey].montantTVA += montantTVA
    acc[tauxKey].totalTTC += totalHT + montantTVA
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

  // Fonction pour formater les nombres avec des virgules
  const formatNumber = (number) => number.toFixed(2).replace('.', ',')

  return (
    <Box>
      {/* En-têtes de colonne */}
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2}>
        <Typography sx={{ fontSize, fontWeight: 'bold', textAlign: 'left' }}>
          Tx TVA
        </Typography>
        <Typography sx={{ fontSize, fontWeight: 'bold', textAlign: 'left' }}>
          HT
        </Typography>
        <Typography sx={{ fontSize, fontWeight: 'bold', textAlign: 'left' }}>
          TVA
        </Typography>
        <Typography sx={{ fontSize, fontWeight: 'bold', textAlign: 'left' }}>
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
          <Typography sx={{ fontSize, textAlign: 'left' }}>{taux}</Typography>
          <Typography sx={{ fontSize, textAlign: 'left' }}>
            {formatNumber(totals.totalHT)}
          </Typography>
          <Typography sx={{ fontSize, textAlign: 'left' }}>
            {formatNumber(totals.montantTVA)}
          </Typography>
          <Typography sx={{ fontSize, textAlign: 'left' }}>
            {formatNumber(totals.totalTTC)}
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
        <Typography sx={{ fontSize, fontWeight: 'bold', textAlign: 'left' }}>
          TOTAUX
        </Typography>
        <Typography sx={{ fontSize, textAlign: 'left' }}>
          {formatNumber(totalHT)}
        </Typography>
        <Typography sx={{ fontSize, textAlign: 'left' }}>
          {formatNumber(totalTVA)}
        </Typography>
        <Typography sx={{ fontSize, textAlign: 'left' }}>
          {formatNumber(totalTTC)}
        </Typography>
      </Box>
    </Box>
  )
}

export default TotauxTVA
