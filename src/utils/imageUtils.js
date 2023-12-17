export function getDefaultImageUrl(baseUrl) {
  return `${baseUrl}/catalogue/default/default.png`
}

export function getProductImageUrl(images, baseUrl) {
  const defaultImagePath = getDefaultImageUrl(baseUrl)
  return images && images.length > 0
    ? `${baseUrl}/${images[0]}`
    : defaultImagePath
}
