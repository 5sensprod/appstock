import JsBarcode from 'jsbarcode'
import { QRCodeCanvas } from 'qrcode.react'
import { createRoot } from 'react-dom/client'
import html2canvas from 'html2canvas'

export const useCodeGeneration = () => {
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

  const generateCode = async (product, codeType, height) => {
    const gencode = product.gencode
    if (!gencode) return false

    const fileName = `${product.reference || 'produit'}_${gencode}_${codeType}.png`
    const heightInPixels = height * 3.7795275591

    let codeElement
    if (codeType === 'barcode') {
      const canvas = document.createElement('canvas')
      JsBarcode(canvas, gencode, {
        format: 'CODE128',
        height: heightInPixels,
        displayValue: true,
      })
      codeElement = canvas
    } else {
      codeElement = (
        <QRCodeCanvas
          id="qrCode"
          value={gencode}
          size={heightInPixels}
          includeMargin={true}
        />
      )
    }

    await generateImageFromElement(codeElement, fileName)
    return true
  }

  return { generateCode }
}
