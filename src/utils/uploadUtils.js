export const isValidFileExtension = (filename) => {
  const validExtensions = ['.png', '.jpg', '.jpeg', '.webp']
  const fileExtension = filename.slice(
    ((filename.lastIndexOf('.') - 1) >>> 0) + 2,
  )
  return validExtensions.includes('.' + fileExtension.toLowerCase())
}
