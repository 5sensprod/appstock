// Fonction pour arrondir à la hausse au 0.05 supérieur
export const roundToNearest05 = (value) => {
  return Math.ceil(value * 20) / 20
}
// Calculer le prix de vente TTC à partir du prix d'achat, du taux de marque et du taux de TVA
export const calculatePriceWithMargin = (prixAchat, marge, tvaRate) => {
  if (!prixAchat || !marge || !tvaRate) return 0
  const prixVenteHT = prixAchat * (1 + marge / 100) // Pour une marge de 50%, coef = 1.5
  const prixVenteTTC = prixVenteHT * (1 + tvaRate / 100)
  return roundToNearest05(prixVenteTTC)
}
// Calculer le taux de marque (%) à partir du prix d'achat HT, du prix de vente TTC et du taux de TVA
export const calculateMarginFromPrice = (prixAchat, prixVenteTTC, tvaRate) => {
  if (!prixAchat || !prixVenteTTC || !tvaRate) return null
  // Conversion du prix TTC en prix HT
  const prixVenteHT = prixVenteTTC / (1 + tvaRate / 100)
  // Calcul de la marge en pourcentage (et non du taux de marque)
  const marge = ((prixVenteHT - prixAchat) / prixAchat) * 100
  return !isNaN(marge) ? parseFloat(marge) : null
}
