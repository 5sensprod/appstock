export function generateTVA(items) {
  // Fonction pour formater les nombres
  const formatNumber = (number) => number.toFixed(2).replace('.', ',')

  // Grouper les articles par taux de TVA et additionner les valeurs
  const totauxParTVA = items.reduce((acc, item) => {
    const tauxTVA = item.tauxTVA
    const quantite = item.quantite || item.quantity
    const puHT = item.puHT || item.prixHT
    const puTTC = item.puTTC || item.prixTTC
    const montantTVA = item.montantTVA || (puTTC - puHT) * quantite

    const tauxKey = `${tauxTVA}%`
    const totalHT = puHT * quantite

    if (!acc[tauxKey]) {
      acc[tauxKey] = { totalHT: 0, montantTVA: 0, totalTTC: 0 }
    }

    acc[tauxKey].totalHT += totalHT
    acc[tauxKey].montantTVA += montantTVA
    acc[tauxKey].totalTTC += puTTC * quantite
    return acc
  }, {})

  // Initialiser les totaux généraux
  let totalHT = 0
  let totalTVA = 0
  let totalTTC = 0

  // Calculer les totaux généraux
  Object.values(totauxParTVA).forEach((totals) => {
    totalHT += totals.totalHT
    totalTVA += totals.montantTVA
    totalTTC += totals.totalTTC
  })

  let tvaContent = '<div style="margin-top: 20px;">'

  // En-têtes de colonne
  tvaContent += `
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; font-size: 10px; font-weight: bold; text-align: left;">
        <span>Tx TVA</span>
        <span>HT</span>
        <span>TVA</span>
        <span>TTC</span>
      </div>`

  // Valeurs pour chaque taux de TVA
  Object.entries(totauxParTVA).forEach(([taux, totals]) => {
    tvaContent += `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; font-size: 10px; text-align: left;">
          <span>${taux}</span>
          <span>${formatNumber(totals.totalHT)}</span>
          <span>${formatNumber(totals.montantTVA)}</span>
          <span>${formatNumber(totals.totalTTC)}</span>
        </div>`
  })

  // Totals généraux
  tvaContent += `
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; margin-top: 20px; border-top: 1px dashed black; padding-top: 10px; font-size: 10px; text-align: left;">
        <span style="font-weight: bold;">TOTAUX</span>
        <span>${formatNumber(totalHT)}</span>
        <span>${formatNumber(totalTVA)}</span>
        <span>${formatNumber(totalTTC)}</span>
      </div>
    </div>`

  return tvaContent
}
