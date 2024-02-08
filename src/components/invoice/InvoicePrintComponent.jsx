import React, { useContext } from 'react'
import { Typography, Box, Grid } from '@mui/material'
import { CompanyInfoContext } from '../../contexts/CompanyInfoContext'
import { formatNumberFrench } from '../../utils/priceUtils'
import './styles/InvoiceTable.css'
import { getLogoUrl } from '../../utils/imageUtils'
import { useConfig } from '../../contexts/ConfigContext'

const InvoicePrintComponent = React.forwardRef(({ invoiceData }, ref) => {
  const { companyInfo } = useContext(CompanyInfoContext)
  const { baseUrl } = useConfig()
  // Formatage de la date pour l'affichage
  const formattedDate =
    invoiceData &&
    new Date(invoiceData.date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const items = invoiceData.items
  const hasAnyDiscountOrMarkup =
    items && items.some((item) => item.remiseMajorationLabel)

  const discountOrMarkupTitle = () => {
    const discountItems = items.filter(
      (item) => item.remiseMajorationLabel === 'Remise',
    ).length
    const markupItems = items.filter(
      (item) => item.remiseMajorationLabel === 'Majoration',
    ).length

    if (discountItems >= markupItems) {
      return 'Remise'
    } else {
      return 'Majoration'
    }
  }

  const generateTableHeaders = () => {
    return (
      <tr>
        <th>Référence</th>
        {hasAnyDiscountOrMarkup && <th align="right">Px Cat. TTC</th>}
        <th align="right">Qté</th>
        <th align="right">P.U HT</th>
        <th align="right">TVA</th>
        <th align="right">P.U TTC</th>
        {hasAnyDiscountOrMarkup && (
          <th align="right">{discountOrMarkupTitle()}</th>
        )}
        <th align="right">Total TTC</th>
      </tr>
    )
  }

  const generateTableRowCells = (item) => {
    return (
      <>
        <td>{item.reference}</td>
        {hasAnyDiscountOrMarkup && (
          <td align="right">
            {item.prixOriginal != null
              ? `${formatNumberFrench(item.prixOriginal)} €`
              : ''}
          </td>
        )}
        <td align="right">{item.quantite}</td>
        <td align="right">{formatNumberFrench(item.puHT)} €</td>
        <td align="right">{parseFloat(item.tauxTVA).toFixed(1)} %</td>
        <td align="right">{formatNumberFrench(item.puTTC)} €</td>
        {hasAnyDiscountOrMarkup && (
          <td align="right">
            {item.remiseMajorationValue !== 0
              ? `${formatNumberFrench(item.remiseMajorationValue)} %`
              : ''}
          </td>
        )}
        <td align="right">{formatNumberFrench(item.totalItem)} €</td>
      </>
    )
  }

  return (
    <Box ref={ref} sx={{ p: 4 }}>
      {/* Entête de la facture */}
      <Box display="flex" justifyContent="space-between">
        {/* Card Entreprise - Haut Droite */}
        <Box>
          <img src={getLogoUrl(baseUrl)} alt="Logo" />
        </Box>
        <Box component="div" border={1} borderRadius={1} p={1}>
          <Typography variant="body1">{companyInfo.name}</Typography>
          <Typography variant="body2">{companyInfo.address}</Typography>
          <Typography variant="body2">{companyInfo.city}</Typography>
          <Typography variant="body2">Tél: {companyInfo.phone}</Typography>
          <Typography variant="body2">Email: {companyInfo.email}</Typography>
          <Typography variant="body2">TVA: {companyInfo.taxId}</Typography>
        </Box>
      </Box>
      {/* Informations de Facturation - Sous la Card Entreprise */}
      <Box m={2}>
        <Typography variant="body2">
          Facture n°{invoiceData.invoiceNumber}
        </Typography>
        <Typography variant="body2">Date: {formattedDate}</Typography>
        <Typography variant="body2">
          Type de paiement: {invoiceData.paymentType}
        </Typography>
      </Box>

      {/* Liste des articles */}
      <div>
        <table className="invoice-table" aria-label="facture articles">
          <thead>{generateTableHeaders(invoiceData.items)}</thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index}>{generateTableRowCells(item)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <Grid container justifyContent="flex-end">
        <Grid item xs={6}>
          <table className="invoice-table invoice-total">
            <tbody>
              <tr>
                <td>Total HT</td>
                <td>{invoiceData.totalHT} €</td>
              </tr>
              <tr>
                <td>TVA</td>
                <td>{invoiceData.totalTVA} €</td>
              </tr>
              {invoiceData.adjustment && invoiceData.adjustment !== 0 && (
                <tr>
                  <td>
                    {invoiceData.adjustment > 0 ? 'Majoration' : 'Remise'}
                  </td>
                  <td>{Math.abs(invoiceData.adjustment)} €</td>
                </tr>
              )}
            </tbody>
          </table>
        </Grid>
      </Grid>

      {/* Total de la facture */}
      <Grid container justifyContent="flex-end">
        <Grid item xs={12}>
          <Typography variant="body1" align="right">
            Net à payer: {invoiceData.totalTTC} €
          </Typography>
        </Grid>
      </Grid>
      {/* Pied de page */}
      <Typography variant="caption">Merci pour votre achat.</Typography>
    </Box>
  )
})

export default InvoicePrintComponent
