// Fonction pour générer le corps du ticket avec les articles
export function generateBody(items) {
  const formatNumber = (input) => {
    const number = parseFloat(input)
    if (isNaN(number)) {
      return 'Invalid input' // Gère l'erreur selon les besoins
    }
    return number.toFixed(2).replace('.', ',')
  }

  const hasRemiseOrMajoration = items.some(
    (item) => item.remiseMajorationValue !== 0,
  )

  let tableContent =
    '<table style="width:100%; border-collapse: collapse; font-size: 10px; text-align:left">' // Applique la taille de police de 10px au tableau entier
  tableContent += '<tr>'
  tableContent += '<th>Qté</th><th>Article</th><th>P.U. EUR</th>'
  if (hasRemiseOrMajoration) {
    tableContent += '<th>Rem. %</th>' // Ajoute la colonne si nécessaire
  }
  tableContent += '<th>TTC EUR</th><th>Tx</th>'
  tableContent += '</tr>'

  items.forEach((item) => {
    tableContent += '<tr>'
    tableContent += `<td>${item.quantite}</td>`
    tableContent += `<td>${item.reference}</td>`
    tableContent += `<td>${formatNumber(item.prixOriginal !== undefined ? item.prixOriginal : item.puTTC)}</td>`
    if (hasRemiseOrMajoration) {
      tableContent += `<td>${formatNumber(item.remiseMajorationValue)}</td>`
    }
    tableContent += `<td>${formatNumber(item.totalItem)}</td>`
    tableContent += `<td>${item.tauxTVA.toString().replace('.', ',')}</td>`
    tableContent += '</tr>'
  })

  tableContent += '</table>'
  return tableContent
}
