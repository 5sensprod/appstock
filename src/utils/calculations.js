export const roundToNearest05 = (value) => {
  return Math.ceil(value * 20) / 20
}

export const calculatePriceWithMargin = (prixAchat, marge, tvaRate) => {
  if (!prixAchat || !marge || !tvaRate) return null

  const prixVenteHT = prixAchat + (prixAchat * marge) / 100
  const prixVenteTTC = prixVenteHT + (prixVenteHT * tvaRate) / 100

  return roundToNearest05(prixVenteTTC)
}
