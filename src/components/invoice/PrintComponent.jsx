import React from 'react'

const PrintComponent = React.forwardRef(({ invoiceData }, ref) => (
  <div ref={ref}>
    <h3>Ticket de caisse</h3>
    {invoiceData.items.map((item, index) => (
      <div key={index}>
        {item.reference} - Quantité: {item.quantite} - Prix HT: {item.puHT}€,
        Prix TTC: {item.puTTC}€
      </div>
    ))}
    <div>Total TTC: {invoiceData.totalTTC}€</div>
  </div>
))

export default PrintComponent
