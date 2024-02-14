import React, { useEffect, useState, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-material.css'
import {
  getInvoices,
  addInvoice,
  updateInvoice,
  deleteInvoice,
} from '../../api/invoiceService'
import { format, parseISO } from 'date-fns'
import frLocale from 'date-fns/locale/fr'

const InvoiceGrid = () => {
  const [invoices, setInvoices] = useState([])
  const [gridApi, setGridApi] = useState(null)

  const onGridReady = useCallback((params) => {
    setGridApi(params.api)
    // AutoSize pour toutes les colonnes
    // params.api.sizeColumnsToFit()
  }, [])
  useEffect(() => {
    const fetchInvoices = async () => {
      const fetchedInvoices = await getInvoices()
      const flattenedInvoices = fetchedInvoices.reduce((acc, invoice) => {
        invoice.items.forEach((item) => {
          acc.push({
            ...item,
            invoiceNumber: invoice.invoiceNumber,
            date: invoice.date,
            totalHT: parseFloat(invoice.totalHT), // Convertir en nombre si nécessaire
            totalTVA: parseFloat(invoice.totalTVA),
            totalTTC: parseFloat(invoice.totalTTC),
            paymentType: invoice.paymentType,
          })
        })
        return acc
      }, [])
      setInvoices(flattenedInvoices)
    }

    fetchInvoices()
  }, [])
  const formatDate = (dateString) => {
    // console.log('Date to format:', dateString) Vérifiez la date avant formatage
    if (dateString) {
      const date = parseISO(dateString)
      const formattedDate = format(date, 'dd/MM/yyyy', { locale: frLocale })
      // console.log('Formatted date:', formattedDate) Vérifiez la date après formatage
      return formattedDate
    }
    return ''
  }
  const columnDefs = [
    { headerName: 'Référence', field: 'reference', resizable: true },
    { headerName: 'Qté', field: 'quantite', resizable: true },
    { headerName: 'PU. HT', field: 'puHT', resizable: true },
    { headerName: 'PU. TTC', field: 'puTTC', resizable: true },
    { headerName: 'TVA', field: 'tauxTVA', resizable: true },
    { headerName: 'Total Article', field: 'totalItem', resizable: true },
    { headerName: 'Montant TVA', field: 'montantTVA', resizable: true },
    {
      headerName: 'Remise/Majoration',
      field: 'remiseMajorationLabel',
      resizable: true,
    },
    {
      headerName: 'Valeur Rem./Maj.',
      field: 'remiseMajorationValue',
      resizable: true,
    },
    { headerName: 'Total HT', field: 'totalHT', resizable: true },
    { headerName: 'Total TVA', field: 'totalTVA', resizable: true },
    { headerName: 'Total TTC', field: 'totalTTC', resizable: true },
    {
      headerName: 'Date',
      field: 'date',
      valueFormatter: (params) => formatDate(params.value),
    },
    { headerName: 'Type de Paiement', field: 'paymentType' },
    { headerName: 'Numéro de Facture', field: 'invoiceNumber' },
    // { headerName: 'ID Facture', field: '_id' },
    // Autres colonnes si nécessaire
  ]

  // Ajouter ici les fonctions pour ajouter, modifier, supprimer

  return (
    <div className="ag-theme-material" style={{ height: 500, width: '100%' }}>
      <AgGridReact
        onGridReady={onGridReady}
        rowData={invoices}
        columnDefs={columnDefs}
        // rowSelection="single"
        pagination={true}
        paginationPageSize={10}
        // enableSorting={true}
        // enableFilter={true}
        resizable={true} // Permet le redimensionnement des colonnes
        suppressColumnMoveAnimation={true} // Améliore les performances lors du déplacement des colonnes
        suppressMovableColumns={false} // Permet de réorganiser les colonnes
        animateRows={true} // Pour des animations de ligne
        // ...autres propriétés
      />
      {/* UI pour les opérations sur les factures */}
    </div>
  )
}

export default InvoiceGrid
