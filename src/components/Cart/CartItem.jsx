import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Box,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ReplayIcon from '@mui/icons-material/Replay'
import { formatPrice } from '../../utils/priceUtils'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ProductModal from '../PRODUCTS/ProductModal'
import { useConfig } from '../../contexts/ConfigContext'

const CartItem = ({
  item,
  updatePrice,
  updateQuantity,
  removeItem,
  onItemChange,
}) => {
  const originalPrice = item.prixVente
  const [priceInput, setPriceInput] = useState(
    item.prixModifie
      ? formatPrice(item.prixModifie)
      : formatPrice(originalPrice),
  )

  const [isModalOpen, setIsModalOpen] = useState(false)
  const { baseUrl } = useConfig()

  const handleModalOpen = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const isPriceEdited =
    item.prixModifie !== undefined && item.prixModifie !== originalPrice

  const handlePriceChange = (event) => {
    const value = event.target.value
    // Autorise uniquement les nombres, +, -, % et remplace les virgules par des points.
    const validValue = value.replace(',', '.').match(/^[-+]?[0-9]*\.?[0-9]*%?$/)
    if (validValue) {
      setPriceInput(value)
    }
    onItemChange()
  }

  const confirmPriceChange = () => {
    let newPrice
    const isPercentageChange = priceInput.includes('%')
    const numericValue = parseFloat(priceInput.replace(/[^0-9.-]/g, ''))

    // Convertissez la valeur saisie au format numérique pour une comparaison précise
    const formattedInputValue = parseFloat(priceInput.replace(',', '.'))

    // Obtenez le prix actuel pour la comparaison
    const currentPrice = item.prixModifie
      ? parseFloat(item.prixModifie)
      : parseFloat(originalPrice)

    // Vérifiez si l'utilisateur a effectivement modifié le prix
    if (formattedInputValue === currentPrice) {
      // Si la valeur n'a pas changé, simplement retourner sans mettre à jour
      return
    }

    if (isNaN(numericValue)) return // Sortie si la valeur n'est pas un nombre

    if (isPercentageChange) {
      // Calcule le nouveau prix en fonction du pourcentage
      const percentage = numericValue / 100
      newPrice = originalPrice + originalPrice * percentage
    } else if (priceInput.startsWith('+') || priceInput.startsWith('-')) {
      // Ajoute ou soustrait la valeur directement si elle commence par + ou -
      newPrice = originalPrice + numericValue
    } else {
      // Sinon, utilise la valeur comme nouveau prix
      newPrice = numericValue
    }

    if (newPrice >= 0) {
      updatePrice(item._id, newPrice)
      setPriceInput(formatPrice(newPrice))
      onItemChange() // S'assurer que ceci est appelé après la mise à jour
    }
  }

  const resetPrice = () => {
    setPriceInput(formatPrice(originalPrice))
    updatePrice(item._id, originalPrice)
  }
  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10)
    if (newQuantity > 0) {
      updateQuantity(item._id, newQuantity)
    } else {
      removeItem(item._id)
    }
    onItemChange()
  }

  const handleRemoveClick = () => {
    removeItem(item._id)
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Box mb={2} display="flex" alignItems="center" gap="20px">
          <Typography variant="h6">{item.reference}</Typography>
          <IconButton onClick={handleModalOpen} size="small" color="success">
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box mb={0}>
          <TextField
            type="text"
            label="Prix en €"
            value={priceInput}
            onChange={handlePriceChange}
            onBlur={confirmPriceChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                confirmPriceChange()
                e.target.blur()
              }
            }}
            size="small"
          />
        </Box>
        {isPriceEdited && (
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Prix catalogue : {formatPrice(originalPrice)}
              <IconButton onClick={resetPrice} size="small">
                <ReplayIcon />
              </IconButton>
            </Typography>
          </Box>
        )}
        <Box mt={2}>
          <TextField
            type="number"
            label="Quantité"
            value={item.quantity}
            onChange={handleQuantityChange}
            inputProps={{ min: 0 }}
            size="small"
          />

          <IconButton onClick={handleRemoveClick}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
      <ProductModal
        product={item}
        baseUrl={baseUrl}
        open={isModalOpen}
        onClose={handleModalClose}
      />
    </Card>
  )
}

export default CartItem
