export const formatPrice = (price, locale = 'fr-FR', currency = 'EUR') => {
  return price.toLocaleString(locale, { style: 'currency', currency: currency })
}

export const calculateTotal = (items, getPrice) => {
  return items.reduce((acc, item) => {
    const itemPrice = getPrice(item)
    const totalItemPrice = itemPrice * item.quantity
    return acc + totalItemPrice
  }, 0)
}

export const calculateInvoiceTotal = (invoiceItems) => {
  return invoiceItems.reduce((total, item) => {
    // Utilise le prix modifié s'il existe, sinon utilise le prix original
    const priceToUse = item.prixModifie ?? item.prixVente
    return total + item.quantity * priceToUse
  }, 0)
}

export const applyCartDiscountOrMarkup = (cartTotal, adjustment) => {
  // Assurez-vous que adjustment est un nombre et pas une chaîne de caractères ou autre
  const numericAdjustment = parseFloat(adjustment)

  // Si numericAdjustment est NaN ou 0, retournez simplement le total du panier original
  if (isNaN(numericAdjustment) || numericAdjustment === 0) {
    return cartTotal
  }

  // Appliquez la remise ou la majoration
  const newTotal = cartTotal + numericAdjustment

  // Assurez-vous que le total ne devienne pas négatif
  return newTotal > 0 ? newTotal : 0
}

export const calculateDiscountMarkup = (originalPrice, modifiedPrice) => {
  let label = ''
  let value = 0

  if (modifiedPrice !== undefined) {
    const difference = modifiedPrice - originalPrice
    value = Math.abs((difference / originalPrice) * 100).toFixed(2)
    label = difference < 0 ? 'Remise' : 'Majoration'
  }

  return {
    label,
    value,
  }
}

// Fonction pour calculer la TVA
export const calculateTax = (price, taxRate) => {
  return price * taxRate
}

// Cette fonction calcule le total par ligne d'article
export const calculateTotalItem = (item) => {
  const priceToUse = item.prixModifie ?? item.prixVente
  const total = priceToUse * item.quantity
  return total.toFixed(2) // Arrondi à deux décimales
}

// Fonction d'aide pour formater les nombres selon la convention française
export const formatNumberFrench = (number) => {
  return parseFloat(number).toLocaleString('fr-FR')
}
