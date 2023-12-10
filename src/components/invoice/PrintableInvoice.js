import React from 'react'
import ReactToPrint from 'react-to-print'
import InvoicePrintComponent from './InvoicePrintComponent'
import { Button } from '@mui/material'

class PrintableInvoice extends React.Component {
  render() {
    return (
      <div>
        <ReactToPrint
          trigger={() => (
            <Button variant="contained">Imprimer la facture</Button>
          )}
          content={() => this.componentRef}
        />
        <InvoicePrintComponent
          ref={(el) => (this.componentRef = el)}
          invoiceData={this.props.invoiceData}
        />
      </div>
    )
  }
}

export default PrintableInvoice
