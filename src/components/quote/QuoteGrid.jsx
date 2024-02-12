import React, { useContext } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { QuoteContext } from '../../contexts/QuoteContext'
import { CartContext } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/priceUtils'
import { IconButton } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
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
    deleteQuote,
  } = useContext(QuoteContext)

  const { setCartItems } = useContext(CartContext)
  const navigate = useNavigate()

  const handleDeleteQuoteFromGrid = async (id) => {
    console.log("Tentative de suppression du devis avec l'ID:", id) // Log l'ID du devis à supprimer

    // Optionnel : Afficher une confirmation ici

    try {
      await deleteQuote(id) // Appel à la fonction deleteQuote du contexte
      console.log('Devis supprimé avec succès, ID:', id) // Confirmation de la suppression réussie

      // Après la suppression, log l'état des devis pour vérifier la mise à jour
      console.log('État des devis après suppression:', quotes)

      // Nettoyage supplémentaire si nécessaire, par exemple, vider le panier ou afficher une notification
    } catch (error) {
      console.error('Erreur lors de la suppression du devis:', error) // Log l'erreur en cas de problème
      // Optionnel : Gérer l'affichage des erreurs ou des notifications ici
    }
  }

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
      width: 150, // Vous pourriez vouloir ajuster la largeur pour accueillir les deux icônes
      renderCell: (params) => (
        <div>
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
      headerName: "Nombre d'articles",
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

  if (isLoading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error}</div>

  return (
    <div style={{ width: 902 }}>
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
