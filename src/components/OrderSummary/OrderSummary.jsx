import React, { useContext } from 'react'
import { CartContext } from '../../contexts/CartContext'
import {
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import { formatPrice } from '../../utils/priceUtils'

const OrderSummary = () => {
  const { cartItems, cartTotals, adjustmentAmount } = useContext(CartContext)

  // Calculer les totaux de TVA pour chaque taux distinct
  const tvaTotals = cartItems.reduce((acc, item) => {
    const taxRate = item.tauxTVA
    const taxAmount = parseFloat(item.montantTVA) * item.quantity // Assurez-vous de multiplier par la quantité

    acc[taxRate] = (acc[taxRate] || 0) + taxAmount
    return acc
  }, {})

  // Déterminer si un ajustement a été appliqué
  const isAdjustmentApplied = adjustmentAmount !== 0

  // Calculer le type d'ajustement
  const adjustmentType = adjustmentAmount > 0 ? 'Majoration' : 'Remise'

  return (
    <Card raised>
      <CardContent>
        <Typography variant="h6">Ticket</Typography>
        <Divider />
        <List>
          {cartItems.map((item) => (
            <ListItem key={item._id}>
              <ListItemText
                primary={item.reference}
                secondary={
                  <>
                    Quantité: {item.quantity}
                    <br />
                    TVA: {item.tva} %
                    <br />
                    Prix unitaire HT: {formatPrice(parseFloat(item.prixHT))}
                    <br />
                    Prix unitaire TTC: {formatPrice(parseFloat(item.puTTC))}
                    {item.remiseMajorationLabel && (
                      <>
                        <br />
                        {item.remiseMajorationLabel}:{' '}
                        {formatPrice(item.remiseMajorationValue)} %
                      </>
                    )}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Typography>
          Sous-total HT: {formatPrice(cartTotals.totalHT)}
        </Typography>
        {Object.entries(tvaTotals).map(([taxRate, total]) => (
          <Typography key={taxRate}>
            TVA ({taxRate}%) : {formatPrice(total)}
          </Typography>
        ))}
        <Divider />
        {isAdjustmentApplied && (
          <Typography>
            {adjustmentType}: {formatPrice(Math.abs(adjustmentAmount))}
          </Typography>
        )}
        <Typography variant="h6">
          Total:{' '}
          {formatPrice(
            isAdjustmentApplied
              ? cartTotals.modifiedTotal
              : cartTotals.totalTTC,
          )}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default OrderSummary
