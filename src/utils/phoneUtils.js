export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return ''

  // Exemple de formatage : 0123456789 -> 01 23 45 67 89
  const cleaned = ('' + phoneNumber).replace(/\D/g, '')
  const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/)

  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`
  }

  return phoneNumber
}
