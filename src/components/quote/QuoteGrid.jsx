import React, { useContext } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { QuoteContext } from '../../contexts/QuoteContext'
import { CartContext } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/priceUtils'
import { IconButton } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate } from 'react-router-dom'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { useGeneratePdf } from './useGeneratePdf'
import { useUI } from '../../contexts/UIContext'

const QuoteGrid = () => {
  const {
    quotes,
    isLoading,
    error,
    setCustomerName,
    setCustomerEmail,
    setCustomerPhone,
    activateQuote,
    deleteQuote,
  } = useContext(QuoteContext)

  const generatePdf = useGeneratePdf()
  const { showToast, showConfirmDialog } = useUI()

  const onPdfIconClick = (quoteId) => {
    generatePdf(quoteId, (message) => showToast(message, 'success'))
  }

  const { setCartItems } = useContext(CartContext)
  const navigate = useNavigate()

  const handleDeleteQuoteFromGrid = (id) => {
    showConfirmDialog(
      'Suppression de devis',
      'Êtes-vous sûr de vouloir supprimer ce devis ?',
      async () => {
        try {
          await deleteQuote(id)
          showToast('Devis supprimé avec succès', 'success')
        } catch (error) {
          console.error('Erreur lors de la suppression du devis:', error)
          showToast('Erreur lors de la suppression du devis', 'error')
        }
      },
    )
  }

  const handleViewQuote = (quote) => {
    // Activer le mode devis avec les détails du devis sélectionné
    activateQuote({
      id: quote._id,
      quoteNumber: quote.quoteNumber,
      contact: quote.customerInfo
        ? `${quote.customerInfo.name || ''} ${quote.customerInfo.email || ''} ${quote.customerInfo.phone || ''}`.trim()
        : 'Non spécifié',
    })

    // Mise à jour des informations du client dans le contexte
    if (quote.customerInfo) {
      const { name, email, phone } = quote.customerInfo
      setCustomerName(name || '')
      setCustomerEmail(email || '')
      setCustomerPhone(phone || '')
    }
    const cartItemsFromQuote = quote.items.map((item) => {
      const prixHT = parseFloat(item.prixHT)
      const prixTTC =
        item.prixTTC !== null
          ? parseFloat(item.prixTTC)
          : parseFloat(item.prixOriginal)
      const quantity = parseInt(item.quantity, 10)

      // Calcul du montant de la TVA pour chaque article
      const montantTVA = (prixTTC - prixHT) * quantity

      return {
        ...item,
        _id: item.id,
        reference: item.reference,
        quantity,
        prixVente: item.prixOriginal,
        puTTC: prixTTC,
        tva: item.tauxTVA,
        tauxTVA: item.tauxTVA,
        prixHT: parseFloat(prixHT.toFixed(2)),
        totalItem: parseFloat((prixTTC * quantity).toFixed(2)),
        montantTVA: parseFloat(montantTVA.toFixed(2)),
        remiseMajorationLabel: item.remiseMajorationLabel || '',
        remiseMajorationValue: item.remiseMajorationValue || 0,
        prixModifie: item.prixTTC,
      }
    })

    setCartItems(cartItemsFromQuote)
    navigate('/')
  }

  const columns = [
    {
      field: 'actions',
      headerName: '',
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton
            onClick={() => onPdfIconClick(params.row._id)}
            color="primary"
            aria-label="create pdf"
          >
            <PictureAsPdfIcon />
          </IconButton>
          <IconButton
            onClick={() => handleViewQuote(params.row)}
            color="primary"
            aria-label="view quote"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteQuoteFromGrid(params.id)}
            color="error"
            aria-label="delete quote"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },

    {
      field: 'quoteNumber',
      headerName: 'Numéro du devis',
      width: 200,
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      // flex: 1,
    },
    {
      field: 'contact',
      headerName: 'Contact',
      width: 150,
      // flex: 1,
      valueGetter: (params) => {
        const info = params.row.customerInfo
        if (!info) return 'Non renseigné'
        return info.name || info.email || info.phone || 'Non renseigné'
      },
    },
    {
      field: 'itemCount',
      headerName: "Nbre d'articles",
      type: 'number',
      width: 100,
      // flex: 1,
      valueGetter: (params) => params.row.items.length,
    },
    {
      field: 'totalTTC',
      headerName: 'Total TTC',
      width: 100,
      valueFormatter: ({ value }) => formatPrice(parseFloat(value)),
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

  if (error) return <div>Erreur: {error}</div>

  return (
    <div style={{ width: 852 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        loading={isLoading}
      />
    </div>
  )
}

export default QuoteGrid
