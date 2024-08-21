// Fonction pour arrondir à la hausse au 0.05 supérieur
export const roundToNearest05 = (value) => {
  return Math.ceil(value * 20) / 20
}

// Calculer le prix de vente TTC à partir du prix d'achat, de la marge et du taux de TVA
export const calculatePriceWithMargin = (prixAchat, marge, tvaRate) => {
  if (!prixAchat || !marge || !tvaRate) return 0 // Retourne 0 si les paramètres sont invalides

  const prixVenteHT = prixAchat + (prixAchat * marge) / 100
  const prixVenteTTC = prixVenteHT + (prixVenteHT * tvaRate) / 100

  return roundToNearest05(prixVenteTTC) // Retourne directement le résultat arrondi
}
// Calculer la marge (%) à partir du prix d'achat HT, du prix de vente TTC et du taux de TVA
export const calculateMarginFromPrice = (prixAchat, prixVenteTTC, tvaRate) => {
  if (!prixAchat || !prixVenteTTC || !tvaRate) return null

  const prixVenteHT = prixVenteTTC / (1 + tvaRate / 100)
  const marge = ((prixVenteHT - prixAchat) / prixAchat) * 100

  return !isNaN(marge) ? parseFloat(marge) : null
}
