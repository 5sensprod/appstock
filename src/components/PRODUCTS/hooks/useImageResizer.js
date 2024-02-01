import Pica from 'pica'

const useImageResizer = () => {
  const maxWidth = 1024
  const maxHeight = 1024

  const resizeImage = async (file) => {
    const pica = new Pica()
    const img = document.createElement('img')
    img.src = URL.createObjectURL(file)

    const canvas = document.createElement('canvas')

    return new Promise((resolve, reject) => {
      img.onload = () => {
        let newWidth, newHeight
        const ratio = img.naturalWidth / img.naturalHeight

        if (
          img.naturalWidth > img.naturalHeight ||
          img.naturalWidth === img.naturalHeight
        ) {
          newWidth = maxWidth
          newHeight = maxWidth / ratio
        } else {
          newHeight = maxHeight
          newWidth = maxHeight * ratio
        }

        canvas.width = newWidth
        canvas.height = newHeight

        pica
          .resize(img, canvas)
          .then((result) => pica.toBlob(result, file.type))
          .then((blob) => {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
            resolve(resizedFile)
          })
          .catch(reject)
      }
      img.onerror = reject
    })
  }

  return resizeImage
}

export default useImageResizer
