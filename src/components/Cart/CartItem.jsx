import React, { useState, useEffect } from 'react'
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

  useEffect(() => {
    setPriceInput(
      item.prixModifie
        ? formatPrice(item.prixModifie)
        : formatPrice(originalPrice),
    )
  }, [item.prixModifie, originalPrice])

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

    const formattedInputValue = parseFloat(priceInput.replace(',', '.'))
    const currentPrice = item.prixModifie
      ? parseFloat(item.prixModifie)
      : parseFloat(originalPrice)

    if (formattedInputValue === currentPrice) {
      return
    }

    if (isNaN(numericValue)) return

    if (isPercentageChange) {
      const percentage = numericValue / 100
      newPrice = originalPrice + originalPrice * percentage
    } else if (priceInput.startsWith('+') || priceInput.startsWith('-')) {
      newPrice = originalPrice + numericValue
    } else {
      newPrice = numericValue
    }

    if (newPrice >= 0) {
      updatePrice(item._id, newPrice)
      setPriceInput(formatPrice(newPrice))
      onItemChange()
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
        <Box mb={1} display="flex" alignItems="center" gap="10px">
          <Typography variant="body1">{item.reference}</Typography>
          <IconButton onClick={handleModalOpen} size="small" color="success">
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" gap="10px">
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
          <TextField
            type="number"
            label="Quantité"
            value={item.quantity}
            onChange={handleQuantityChange}
            inputProps={{ min: 0 }}
            size="small"
            sx={{ width: 90 }}
          />
          <IconButton onClick={handleRemoveClick} size="small">
            <DeleteIcon />
          </IconButton>
        </Box>
        {isPriceEdited && (
          <Box mb={0} display="flex" alignItems="center">
            <Typography variant="body2" color="textSecondary">
              Prix catalogue : {formatPrice(originalPrice)}
            </Typography>
            <IconButton onClick={resetPrice} size="small">
              <ReplayIcon />
            </IconButton>
          </Box>
        )}
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
