export function generateTotals(documentData) {
  // Fonction pour formater les nombres
  const formatNumber = (number) => number.toFixed(2).replace('.', ',')

  return `
    <div style="margin-top: 10px;">
    <div style="display: flex; justify-content: space-between; margin-top: 10px; font-weight: bold; font-size: 13px;">
        <span>Total TTC EUR</span>
        <span>${formatNumber(documentData.totalTTC)}</span>
      </div>
      </div>
    `
}
