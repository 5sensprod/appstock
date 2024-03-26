export function generateTotals(documentData) {
  // Fonction pour formater les nombres
  const formatNumber = (number) => number.toFixed(2).replace('.', ',')

  return `
    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 13px;">
      <span>Total TTC EUR</span>
      <span>${formatNumber(documentData.totalTTC)}</span>
    </div>
    `
}
