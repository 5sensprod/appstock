export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  const re = /^\d{10}$/
  return re.test(phone)
}

export const validateWebsite = (website) => {
  const re = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  return re.test(website)
}

export const validatePostalCode = (postalCode) => {
  const re = /^\d{5}$/
  return re.test(postalCode)
}
