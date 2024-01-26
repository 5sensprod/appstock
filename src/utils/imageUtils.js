export function getDefaultImageUrl(baseUrl) {
  return `${baseUrl}/catalogue/default/default.png`
}

export function getProductImageUrl(images, baseUrl) {
  const defaultImagePath = getDefaultImageUrl(baseUrl)
  const isDefaultImage = !(images && images.length > 0)

  return {
    url: isDefaultImage ? defaultImagePath : `${baseUrl}/${images[0]}`,
    isDefault: isDefaultImage,
  }
}

export function getLogoUrl(baseUrl) {
  return `${baseUrl}/catalogue/default/logo.png`
}
