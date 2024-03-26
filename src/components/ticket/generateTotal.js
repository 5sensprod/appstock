export function generateTotals(documentData) {
  // Fonction pour formater les nombres
  const formatNumber = (number) => number.toFixed(2).replace('.', ',')

  return `
    <div style="margin-top: 10px;">
      <p class="line" style="margin-bottom: 5px; margin-top: 0;">.............................................................</p>
      <div style="display: flex; justify-content: space-between; margin-top: 10px; font-weight: bold; font-size: 20px;">
        <span>Total TTC EUR</span>
        <span>${formatNumber(documentData.totalTTC)}</span>
      </div>
      <p class="line" style="margin-bottom: 5px; margin-top: 0;">.............................................................</p>
    </div>
    `
}
