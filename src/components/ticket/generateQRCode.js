import QRCode from 'qrcode'

export const generateQRCodeHTML = async (data) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, { width: 50, margin: 1 })
    return `<div style="text-align: center; margin-top: 20px;"><img src="${qrCodeDataURL}" alt="QR Code" style="width: 50px; height: 50px;"></div>`
  } catch (err) {
    console.error(err)
    return '<div style="text-align: center; margin-top: 20px;">Erreur de QR Code</div>'
  }
}
