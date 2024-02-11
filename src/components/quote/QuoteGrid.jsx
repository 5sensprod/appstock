import React, { useContext } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { QuoteContext } from '../../contexts/QuoteContext'
import { CartContext } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/priceUtils'
import { IconButton } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'

const QuoteGrid = () => {
  const { quotes, isLoading, error } = useContext(QuoteContext)
  const { setCartItems } = useContext(CartContext)

  const handleViewQuote = (quote) => {
    const cartItemsFromQuote = quote.items.map((item) => {
      // Calculer le montant de la TVA pour chaque article
      const prixHT = parseFloat(item.prixHT)
      const prixTTC = parseFloat(item.prixTTC)
      const quantity = item.quantity
      const montantTVA = (prixTTC - prixHT) * quantity

      return {
        ...item,
        _id: item.id,
        reference: item.reference,
        quantity: item.quantity,
        prixVente: item.prixTTC, // Assumer que prixVente correspond au prixTTC pour la logique de l'application
        puTTC: item.prixTTC,
        tva: item.tauxTVA, // Assumer que tva et tauxTVA sont identiques et utilisés de manière interchangeable
        tauxTVA: item.tauxTVA,
        prixHT: item.prixHT,
        totalItem: item.totalTTCParProduit,
        montantTVA: montantTVA.toFixed(2), // Ajouter le montant de la TVA calculé ici
        remiseMajorationLabel: item.remiseMajorationLabel,
        remiseMajorationValue: item.remiseMajorationValue,
        // Le calcul de prixModifie pourrait être inclus ici si nécessaire, en fonction de la logique spécifique de l'application
      }
    })

    setCartItems(cartItemsFromQuote)
  }

  const columns = [
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleViewQuote(params.row)}
          color="primary"
          aria-label="view quote"
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },

    {
      field: 'quoteNumber',
      headerName: 'Numéro du devis',
      flex: 1,
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 130,
      flex: 1,
    },
    {
      field: 'contact',
      headerName: 'Contact',
      width: 200,
      flex: 1,
      valueGetter: (params) => {
        const info = params.row.customerInfo
        if (!info) return 'Non renseigné'
        return info.name || info.email || info.phone || 'Non renseigné'
      },
    },
    {
      field: 'itemCount',
      headerName: "Nombre d'articles",
      type: 'number',
      width: 150,
      flex: 1,
      valueGetter: (params) => params.row.items.length,
    },
    {
      field: 'totalTTC',
      headerName: 'Total TTC',
      flex: 1,
      valueFormatter: ({ value }) => formatPrice(value),
    },
  ]

  const sortedQuotes = [...quotes].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  )

  const rows = sortedQuotes.map((quote) => ({
    id: quote._id,
    ...quote,
    date: new Date(quote.date).toLocaleDateString(),
  }))

  if (isLoading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error}</div>

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  )
}

export default QuoteGrid
