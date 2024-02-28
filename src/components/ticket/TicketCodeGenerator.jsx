import React from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import Button from '@mui/material/Button'
import { Box, Typography, Grid } from '@mui/material'
import { useInvoices } from '../../contexts/InvoicesContext'
import { QRCodeCanvas } from 'qrcode.react'
import DashedLine from '../ui/DashedLine'
import HeaderCompany from '../users/HeaderCompany'
import Remerciement from '../ui/Remerciement'
import HeaderPdf from '../pdf/HeaderPdf'

const TicketCodeGenerator = ({ ticketId }) => {
  const { tickets } = useInvoices()

  const ticket = tickets.find((ticket) => ticket._id === ticketId)

  const HeaderTicket = ({ ticket }) => {
    // Formattez la date et l'heure de manière lisible
    const formatDate = (dateString) => {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }
      return new Intl.DateTimeFormat('fr-FR', options).format(
        new Date(dateString),
      )
    }

    return (
      <>
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Typography variant="body1" fontSize={14} sx={{ fontWeight: 'bold' }}>
            TICKET
          </Typography>
          <Typography variant="body1" fontSize={10}>
            Numéro : {ticket.ticketNumber}
          </Typography>
          <Typography variant="body1" fontSize={10}>
            Le {formatDate(ticket.date)}
          </Typography>
        </Box>
      </>
    )
  }

  const BodyTicket = ({ ticket }) => {
    return (
      <Box textAlign={'left'}>
        <Grid container spacing={1} alignItems="center">
          {/* En-têtes avec style spécifique */}
          <Grid item xs={2}>
            <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>
              Qté
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>
              Article
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>
              P.U. EUR
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>
              TTC EUR
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>
              Tx
            </Typography>
          </Grid>

          {/* Lignes d'articles avec style spécifique pour le texte */}
          {ticket.items.map((item) => (
            <React.Fragment key={item.reference}>
              <Grid item xs={2}>
                <Typography sx={{ fontSize: '10px' }}>
                  {item.quantite}
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography sx={{ fontSize: '10px' }}>
                  {item.reference}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography sx={{ fontSize: '10px' }}>
                  {item.puTTC.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography sx={{ fontSize: '10px' }}>
                  {(item.quantite * item.puTTC).toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography sx={{ fontSize: '10px' }}>
                  {item.tauxTVA}
                </Typography>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Box>
    )
  }

  const TotauxTVA = ({ ticket }) => {
    // Grouper les articles par taux de TVA et additionner les valeurs
    const totauxParTVA = ticket.items.reduce((acc, item) => {
      const { tauxTVA, montantTVA, puHT, quantite } = item
      const totalHT = puHT * quantite
      const totalTVA = montantTVA * quantite
      const tauxKey = `Tx TVA ${tauxTVA}%`

      if (!acc[tauxKey]) {
        acc[tauxKey] = { totalHT: 0, montantTVA: 0, totalTTC: 0 }
      }

      acc[tauxKey].totalHT += totalHT
      acc[tauxKey].montantTVA += totalTVA // Utiliser totalTVA qui a été ajusté par la quantité
      acc[tauxKey].totalTTC += totalHT + totalTVA // Calculer le total TTC à partir du total HT et total TVA
      return acc
    }, {})

    // Calculer les totaux HT, TVA, et TTC avant le return
    let totalHT = 0
    let totalTVA = 0
    let totalTTC = 0

    Object.values(totauxParTVA).forEach((totals) => {
      totalHT += totals.totalHT
      totalTVA += totals.montantTVA
      totalTTC += totals.totalTTC
    })

    return (
      <Box>
        {/* En-têtes de colonne */}
        <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2}>
          <Typography
            sx={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'left' }}
          >
            Tx TVA
          </Typography>
          <Typography
            sx={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'left' }}
          >
            HT
          </Typography>
          <Typography
            sx={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'left' }}
          >
            TVA
          </Typography>
          <Typography
            sx={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'left' }}
          >
            TTC
          </Typography>
        </Box>

        {/* Valeurs pour chaque taux de TVA */}
        {Object.entries(totauxParTVA).map(([taux, totals]) => (
          <Box
            key={taux}
            display="grid"
            gridTemplateColumns="repeat(4, 1fr)"
            gap={2}
          >
            {/* Afficher le taux de TVA */}
            <Typography sx={{ fontSize: '10px', textAlign: 'left' }}>
              {taux.replace('Tx TVA ', '')}
            </Typography>
            {/* Afficher les totaux pour HT, TVA, et TTC */}
            <Typography sx={{ fontSize: '10px', textAlign: 'left' }}>
              {totals.totalHT.toFixed(2)}
            </Typography>
            <Typography sx={{ fontSize: '10px', textAlign: 'left' }}>
              {totals.montantTVA.toFixed(2)}
            </Typography>
            <Typography sx={{ fontSize: '10px', textAlign: 'left' }}>
              {totals.totalTTC.toFixed(2)}
            </Typography>
          </Box>
        ))}
        {/* Totals généraux */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(4, 1fr)"
          gap={2}
          sx={{ mt: 2, borderTop: '1px dashed black', pt: 1 }}
        >
          <Typography
            sx={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'left' }}
          >
            TOTAUX
          </Typography>
          <Typography sx={{ fontSize: '10px', textAlign: 'left' }}>
            {totalHT.toFixed(2)}
          </Typography>
          <Typography sx={{ fontSize: '10px', textAlign: 'left' }}>
            {totalTVA.toFixed(2)}
          </Typography>
          <Typography sx={{ fontSize: '10px', textAlign: 'left' }}>
            {totalTTC.toFixed(2)}
          </Typography>
        </Box>
      </Box>
    )
  }

  const TotalTTC = ({ totalTTC }) => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 'bold', fontSize: '12px' }}
        >
          Total TTC EUR
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontWeight: 'bold', fontSize: '12px' }}
        >
          {totalTTC.toFixed(2)}
        </Typography>
      </Box>
    )
  }

  const PaymentType = ({
    paymentType,
    cashDetails = {},
    paymentDetails = [],
    totalTTC,
  }) => {
    const getReadablePaymentType = (type) => {
      switch (type) {
        case 'CB':
          return 'Carte Bancaire'
        case 'Cash':
          return 'Espèces'
        case 'Cheque':
          return 'Chèque'
        case 'ChequeCadeau':
          return 'Chèque Cadeau'
        case 'Virement':
          return 'Virement'
        case 'Avoir':
          return 'Avoir'
        default:
          return type
      }
    }

    const formatAmount = (amount) => {
      return parseFloat(amount).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    }

    const paymentTypeDisplay = () => {
      switch (paymentType) {
        case 'Cash':
          return (
            <Grid container>
              <Grid item xs={6} textAlign={'right'}>
                <Typography variant="body2" fontSize="12px">
                  {`${getReadablePaymentType(paymentType)} :`}
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign={'right'}>
                <Typography variant="body2" fontSize="12px">
                  {`${formatAmount(cashDetails.givenAmount)}`}
                </Typography>
              </Grid>
              {cashDetails.changeAmount !== undefined && (
                <>
                  <Grid item xs={6} textAlign={'right'}>
                    <Typography variant="body2" fontSize="12px">
                      Rendu :
                    </Typography>
                  </Grid>
                  <Grid item xs={6} textAlign={'right'}>
                    <Typography variant="body2" fontSize="12px">
                      {formatAmount(cashDetails.changeAmount)}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          )
        case 'Multiple':
          return (
            <Grid container>
              {paymentDetails && paymentDetails.length > 0 ? (
                paymentDetails.map((detail, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={6} textAlign={'right'}>
                      <Typography variant="body2" fontSize="12px">
                        {getReadablePaymentType(detail.type)} :
                      </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign={'right'}>
                      <Typography variant="body2" fontSize="12px">
                        {formatAmount(detail.amount)}
                      </Typography>
                    </Grid>
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body2" fontSize="12px">
                  Paiements multiples
                </Typography>
              )}
            </Grid>
          )
        default:
          return (
            <Grid container>
              <Grid item xs={6} textAlign={'right'}>
                <Typography variant="body2" fontSize="12px">
                  {`${getReadablePaymentType(paymentType)} :`}
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign={'right'}>
                <Typography variant="body2" fontSize="12px">
                  {formatAmount(totalTTC)}
                </Typography>
              </Grid>
            </Grid>
          )
      }
    }

    return <Box sx={{ mt: 2 }}>{paymentTypeDisplay()}</Box>
  }

  if (!ticket) {
    return <Typography>Ticket non trouvé</Typography>
  }

  const generatePDF = async () => {
    const input = document.getElementById('printArea')
    const canvas = await html2canvas(input)
    const imgData = canvas.toDataURL('image/png')

    const imgWidth = 80 // Largeur fixe en mm pour un ticket de caisse
    // Calculer la nouvelle hauteur basée sur le ratio de l'image
    const imgHeight = canvas.height * 0.264583 // Convertir la hauteur en mm (1px = 0.264583 mm)

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [imgWidth, imgHeight],
    })

    // Assurez-vous que la largeur et la hauteur de l'image ajoutée correspondent au format du PDF
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(`${ticket.ticketNumber}-ticket.pdf`)
  }

  return (
    <Box>
      <Box
        id="printArea"
        sx={{
          width: '260px',
          minHeight: '400px',
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          border: '1px solid #ddd',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '15px',
          margin: '20px auto',
          borderRadius: '5px',
        }}
      >
        <HeaderCompany />
        <DashedLine />
        <HeaderPdf data={ticket} title="TICKET" numberPropName="ticketNumber" />
        <DashedLine />
        <BodyTicket ticket={ticket} />
        <DashedLine />
        <TotalTTC totalTTC={ticket.totalTTC} />
        <DashedLine />
        <TotauxTVA ticket={ticket} />
        <DashedLine />
        <PaymentType
          paymentType={ticket.paymentType}
          cashDetails={ticket.cashDetails}
          paymentDetails={ticket.paymentDetails}
          totalTTC={ticket.totalTTC}
        />
        <DashedLine />
        <Remerciement />
        <QRCodeCanvas value={ticket.ticketNumber} size={50} />
      </Box>
      <Button variant="contained" onClick={generatePDF}>
        Télécharger Ticket PDF
      </Button>
    </Box>
  )
}

export default TicketCodeGenerator
