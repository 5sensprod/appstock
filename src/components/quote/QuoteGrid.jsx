import React, { useContext } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { QuoteContext } from '../../contexts/QuoteContext'
import { CartContext } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/priceUtils'
import { IconButton } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useNavigate } from 'react-router-dom'

const QuoteGrid = () => {
  const {
    quotes,
    isLoading,
    error,
    setCustomerName,
    setCustomerEmail,
    setCustomerPhone,
    activateQuote,
  } = useContext(QuoteContext)
  const { setCartItems } = useContext(CartContext)
  const navigate = useNavigate()

  const handleViewQuote = (quote) => {
    // Activer le mode devis avec les détails du devis sélectionné
    // Activer le mode devis avec les détails du devis sélectionné, incluant l'_id
    activateQuote({
      id: quote._id, // Transmettre explicitement l'_id du devis
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
      // Assurez-vous que les valeurs sont correctement traitées comme des nombres
      const prixHT = parseFloat(item.prixHT)
      // Utilisez prixTTC si disponible, sinon fallback sur prixOriginal pour refléter le prix actuel de l'article
      const prixTTC =
        item.prixTTC !== null
          ? parseFloat(item.prixTTC)
          : parseFloat(item.prixOriginal)
      const quantity = item.quantity

      // Calculer le montant de la TVA pour chaque article
      // Le montant de la TVA par article est la différence entre le prix TTC (ou prix modifié) et le prix HT, multipliée par la quantité
      const montantTVA = (prixTTC - prixHT) * quantity

      return {
        ...item,
        _id: item.id, // Assurez-vous d'utiliser l'identifiant unique de l'article
        reference: item.reference,
        quantity: item.quantity,
        prixVente: item.prixOriginal, // Utiliser prixOriginal pour conserver le prix de vente original
        puTTC: prixTTC, // Utiliser prixTTC comme le prix actuel de l'article, reflétant le prix modifié si applicable
        tva: item.tauxTVA, // Utiliser tauxTVA pour le taux de TVA
        tauxTVA: item.tauxTVA, // Répéter pour clarté, bien que redondant avec tva
        prixHT: prixHT.toFixed(2), // Formaté pour cohérence
        totalItem: (prixTTC * quantity).toFixed(2), // Calculer le total TTC basé sur le prix TTC actuel et la quantité
        montantTVA: montantTVA.toFixed(2), // Ajouter le montant de la TVA calculé
        remiseMajorationLabel: item.remiseMajorationLabel || '', // Inclure le label de remise/majoration
        remiseMajorationValue: item.remiseMajorationValue || 0, // Inclure la valeur de remise/majoration
        prixModifie: item.prixTTC, // Conserver explicitement prixModifie pour indiquer le prix modifié, même s'il est null
      }
    })

    setCartItems(cartItemsFromQuote)
    navigate('/')
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
