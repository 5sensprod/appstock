export const capitalizeFirstLetter = (string) => {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const convertToNumber = (value, defaultValue = 0) => {
  const number = parseFloat(value)
  return isNaN(number) ? defaultValue : number
}

export const formatNumberWithComma = (number) => {
  // Vérifie si le nombre est un entier
  if (Number.isInteger(number)) {
    return number.toString()
  } else {
    // Pour les nombres avec des décimales, remplace le point par une virgule
    return number.toString().replace('.', ',')
  }
}
