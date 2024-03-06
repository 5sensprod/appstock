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
import { formatNumberWithComma } from '../../utils/formatUtils'

const OrderSummary = () => {
  const { cartItems, cartTotals, adjustmentAmount } = useContext(CartContext)

  const tvaTotals = cartItems.reduce((acc, item) => {
    const taxRate = formatNumberWithComma(item.tauxTVA)
    const taxAmount = parseFloat(item.montantTVA) * item.quantity

    acc[taxRate] = (acc[taxRate] || 0) + taxAmount
    return acc
  }, {})

  const isAdjustmentApplied = adjustmentAmount !== 0
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
                    TVA: {formatNumberWithComma(item.tva)} %
                    <br />
                    Prix unitaire HT: {formatPrice(parseFloat(item.prixHT))}
                    <br />
                    Prix unitaire TTC: {formatPrice(parseFloat(item.puTTC))}
                    {item.quantity >= 2 && (
                      <>
                        <br />
                        Total TTC: {formatPrice(parseFloat(item.totalItem))}
                      </>
                    )}
                    {item.remiseMajorationLabel &&
                      parseFloat(item.remiseMajorationValue) > 0 && (
                        <>
                          <br />
                          {item.remiseMajorationLabel}:{' '}
                          {formatNumberWithComma(
                            parseFloat(item.remiseMajorationValue),
                          )}{' '}
                          %
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
