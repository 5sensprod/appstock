// src/utils/lcdDisplayUtils.js
import { updateLcdDisplay } from '../ipcHelper'

export const displayTotalOnLcd = (cartTotals, adjustmentAmount) => {
  const total =
    adjustmentAmount !== 0 ? cartTotals.modifiedTotal : cartTotals.originalTotal
  const formattedTotal = total
    .toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: false, // Empêche les séparateurs de milliers
    })
    .replace('.', ',') // Remplace le point par une virgule pour les décimales

  updateLcdDisplay({ line1: 'Total à payer', line2: `${formattedTotal} EUR` })
}
