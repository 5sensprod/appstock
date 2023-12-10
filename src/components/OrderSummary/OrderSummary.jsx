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
import { formatNumberFrench } from '../../utils/priceUtils'

const OrderSummary = () => {
  const { cartItems, cartTotals, adjustmentAmount } = useContext(CartContext)
  const tauxTVA = cartItems.length > 0 ? cartItems[0].tauxTVA : '0.00'

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
                    Prix unitaire HT: {formatPrice(parseFloat(item.prixHT))}
                    <br />
                    Prix unitaire TTC: {formatPrice(parseFloat(item.puTTC))}
                    {item.remiseMajorationLabel && (
                      <>
                        <br />
                        {item.remiseMajorationLabel}:{' '}
                        {formatNumberFrench(item.remiseMajorationValue)} %
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
        <Typography>
          TVA ({tauxTVA}%) : {formatPrice(cartTotals.totalTaxes)}
        </Typography>
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
