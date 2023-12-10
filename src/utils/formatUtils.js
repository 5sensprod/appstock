export const capitalizeFirstLetter = (string) => {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const convertToNumber = (value, defaultValue = 0) => {
  const number = parseFloat(value)
  return isNaN(number) ? defaultValue : number
}
