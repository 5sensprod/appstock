import React from 'react'
import InvoiceGrid from '../invoice/InvoiceGrid'
import InvoicesGrid from '../invoice/InvoicesGrid'
import TicketsGrid from '../ticket/TicketsGrid'

const InvoicePage = () => {
  return (
    <div>
      {/* <InvoiceGrid /> */}
      <InvoicesGrid />
      <TicketsGrid />
    </div>
  )
}

export default InvoicePage
