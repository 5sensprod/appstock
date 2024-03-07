export const capitalizeFirstLetter = (string) => {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const convertToNumber = (value, defaultValue = 0) => {
  const number = parseFloat(value)
  return isNaN(number) ? defaultValue : number
}

export const formatNumberWithComma = (number) => {
  // Vérifie si "number" est une chaîne vide ou si ce n'est pas un nombre
  if (number === '' || isNaN(number)) {
    return '0' // Retourne '0' ou une autre valeur par défaut selon votre besoin
  }

  // Convertit "number" en nombre si ce n'est pas déjà le cas
  const num = Number(number)

  // Vérifie si le nombre est un entier
  if (Number.isInteger(num)) {
    return num.toString()
  } else {
    // Pour les nombres avec des décimales, remplace le point par une virgule
    return num.toString().replace('.', ',')
  }
}
