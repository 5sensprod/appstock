function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function formatLcdMessage(data) {
  const line1Clean = removeAccents(data.line1)
  const line2Clean = removeAccents(data.line2)
  const line1 = line1Clean.padEnd(20).substring(0, 20)
  const line2 = line2Clean.padEnd(20).substring(0, 20)
  return `${line1}${line2}`
}

module.exports = {
  removeAccents,
  formatLcdMessage,
}
