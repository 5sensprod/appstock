import React, { useContext } from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
// import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from '@mui/material'
import { useInvoices } from '../../contexts/InvoicesContext'
import { QRCodeCanvas } from 'qrcode.react'
import { CompanyInfoContext } from '../../contexts/CompanyInfoContext'

const TicketCodeGenerator = ({ ticketId }) => {
  const { tickets } = useInvoices()

  const ticket = tickets.find((ticket) => ticket._id === ticketId)

  const DashedLine = () => {
    return (
      <Box
        sx={{
          border: 0,
          borderBottom: '1px dashed #000',
          width: '100%',
          margin: '8px 0',
        }}
      />
    )
  }

  const HeaderCompany = () => {
    const { companyInfo } = useContext(CompanyInfoContext)

    return (
      <Box>
        {' '}
        {/* Applique un style commun à tous les éléments p */}
        <Typography
          variant="body2" // Utilise une variante prédéfinie pour contrôler la taille de police et le style
          //   component="p"
          //   sx={{ marginBottom: '1px', fontWeight: 'bold', fontSize: '12px' }}
          fontWeight={'bold'}
        >
          {companyInfo?.name.toUpperCase()}
        </Typography>
        {[
          'address',
          'city',
          'phone',
          'email',
          `Tax ID: ${companyInfo?.taxId}`,
        ].map((info, index) => (
          <Typography key={index} variant="body2" fontSize={10}>
            {' '}
            {companyInfo?.[info] || info}
          </Typography>
        ))}
      </Box>
    )
  }

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
      const tauxKey = `Tx TVA ${tauxTVA}%`

      if (!acc[tauxKey]) {
        acc[tauxKey] = { totalHT: 0, montantTVA: 0, totalTTC: 0 }
      }

      acc[tauxKey].totalHT += totalHT
      acc[tauxKey].montantTVA += montantTVA
      acc[tauxKey].totalTTC += item.totalItem
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
        {Object.entries(totauxParTVA).map(([taux, totals]) => (
          <Box
            key={taux}
            display="grid"
            gridTemplateColumns="repeat(4, 1fr)"
            gap={1}
            sx={{ mt: 2 }}
          >
            <Typography sx={{ fontSize: '10px', textAlign: 'left' }}>
              {taux}
            </Typography>
            <Typography sx={{ fontSize: '10px', textAlign: 'right' }}>
              HT: {totals.totalHT.toFixed(2)}€
            </Typography>
            <Typography sx={{ fontSize: '10px', textAlign: 'right' }}>
              TVA: {totals.montantTVA.toFixed(2)}€
            </Typography>
            <Typography sx={{ fontSize: '10px', textAlign: 'right' }}>
              TTC: {totals.totalTTC.toFixed(2)}€
            </Typography>
          </Box>
        ))}
        <Box
          display="grid"
          gridTemplateColumns="repeat(4, 1fr)"
          gap={1}
          sx={{ mt: 2, borderTop: '1px solid black', pt: 1 }}
        >
          <Typography
            sx={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'left' }}
          >
            TOTAUX
          </Typography>
          <Typography
            sx={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'right' }}
          >
            HT: {totalHT.toFixed(2)}€
          </Typography>
          <Typography
            sx={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'right' }}
          >
            TVA: {totalTVA.toFixed(2)}€
          </Typography>
          <Typography
            sx={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'right' }}
          >
            TTC: {totalTTC.toFixed(2)}€
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

  const PaymentType = ({ paymentType }) => {
    // Ici, vous pouvez ajouter une logique pour traduire ou formater le type de paiement si nécessaire
    const paymentTypeDisplay =
      paymentType === 'CB' ? 'Carte Bancaire' : paymentType

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" component="p">
          Type de paiement : {paymentTypeDisplay}
        </Typography>
      </Box>
    )
  }

  const Remerciement = () => {
    return (
      <Box sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
        <Typography variant="subtitle2">Merci de votre visite</Typography>
      </Box>
    )
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
        <HeaderTicket ticket={ticket} />
        <DashedLine />
        <BodyTicket ticket={ticket} />
        <DashedLine />
        <TotalTTC totalTTC={ticket.totalTTC} />
        <DashedLine />
        <TotauxTVA ticket={ticket} />
        <DashedLine />
        <PaymentType paymentType={ticket.paymentType} />
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
