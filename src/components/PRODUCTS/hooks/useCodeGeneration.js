import React from 'react'
import JsBarcode from 'jsbarcode'
import { QRCodeCanvas } from 'qrcode.react'
import { createRoot } from 'react-dom/client'
import html2canvas from 'html2canvas'

export const useCodeGeneration = () => {
  const generateBarcode = async (product, heightInPixels) => {
    const canvas = document.createElement('canvas')
    JsBarcode(canvas, product.gencode, {
      format: 'CODE128',
      height: heightInPixels,
      displayValue: true,
    })
    return canvas
  }

  const generateQRCode = (product, heightInPixels) => {
    return (
      <QRCodeCanvas
        id="qrCode"
        value={product.gencode}
        size={heightInPixels}
        includeMargin={true}
      />
    )
  }

  const generateImageFromElement = async (element, fileName) => {
    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.top = '-10000px'
    document.body.appendChild(container)

    if (element instanceof HTMLCanvasElement) {
      container.appendChild(element)
    } else {
      const root = createRoot(container)
      root.render(element)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    const canvas = await html2canvas(container, {
      backgroundColor: null,
      scale: 2,
    })

    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataUrl
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    document.body.removeChild(container)
  }

  const generateCodesForProducts = async (
    selectedProducts,
    codeType,
    height,
  ) => {
    const heightInPixels = height * 3.7795275591
    let codesGenerated = false

    for (const product of selectedProducts) {
      const gencode = product.gencode || ''
      if (!gencode) continue

      codesGenerated = true
      const fileName = `${product.reference || 'produit'}_${gencode}_${codeType}.png`

      const codeElement =
        codeType === 'barcode'
          ? await generateBarcode(product, heightInPixels)
          : generateQRCode(product, heightInPixels)

      await generateImageFromElement(codeElement, fileName)
    }

    return codesGenerated
  }

  return { generateCodesForProducts }
}
