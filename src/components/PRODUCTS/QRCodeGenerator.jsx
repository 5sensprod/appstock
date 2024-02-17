import React from 'react'
import { QRCodeCanvas } from 'qrcode.react' // Pour générer le QR code
import Barcode from 'react-barcode' // Pour générer le code-barres
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'

const QRCodeGenerator = ({ productId }) => {
  const { products } = useProductContextSimplified()
  const product = products.find((product) => product._id === productId)

  if (!product) {
    return <div>Produit non trouvé</div>
  }

  const gencode = product.gencode

  return (
    <div style={{ textAlign: 'center' }}>
      <h3>{product.reference}</h3>
      <p>{gencode}</p>
      {/* QR Code */}
      <div>
        <h4>QR Code</h4>
        <QRCodeCanvas value={gencode} size={256} />
      </div>
      {/* Barcode */}
      <div style={{ marginTop: '20px' }}>
        <h4>Code-barres</h4>
        <Barcode
          value={gencode}
          format="CODE128"
          displayValue={false}
          height={50}
          width={2}
        />
      </div>
    </div>
  )
}

export default QRCodeGenerator
