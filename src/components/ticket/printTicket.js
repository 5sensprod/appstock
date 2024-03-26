import { sendPrintRequest } from '../../ipcHelper'
import { generateHeader } from './generateHeader'
import { generateBody } from './generateBody'
import { generateTotals } from './generateTotal'
import { generateTVA } from './generateTVA'
import { generatePaymentType } from '../pdf/generatePaymentType'
import { generateRemerciement } from './generateRemerciement'
import QRCode from 'qrcode'
import moment from 'moment'
import 'moment/locale/fr'

const generateQRCodeDataURL = async (data) => {
  try {
    return await QRCode.toDataURL(data, { width: 60, margin: 1 })
  } catch (err) {
    console.error(err)
    return ''
  }
}

export const printTicket = async (documentData, documentType, companyInfo) => {
  moment.locale('fr') // Configure le locale de Moment.js à français
  const qrCodeDataURL = await generateQRCodeDataURL(documentData.number)
  const now = new Date() // Obtient la date et l'heure actuelles
  // Utilise Moment.js pour formater 'now' selon le format désiré directement
  let formattedDateTime = moment(now).format('dddd D MMMM, HH:mm:ss')

  let printContent = `
<html>
<head>
<title>Print</title>
<style>
  @media print {
    @page {
      margin-top: -2mm;

    }
    html, body {
      font-family: 'Helvetica', sans-serif;
    }
    .header, .content, .item, .item-details, .totalht, .total, .message {
      text-align: center; margin-top: 0; margin-bottom: 1px;
    }
    .company {
      font-size: 22px;
      font-weight: bold;
    }
    .header {
      font-size: 21px;
      font-weight: bold;
    }
    .line {
      text-align: center; margin-top: 0;
    }
    .content {
      font-size: 18px;
    }
    .item-details span {
      display: block;
    }
  }
  .company, .header, .content, .item, .item-details, .totalht, .total, .message {
    text-align: center; margin-top: 0; margin-bottom: 1px;
  }
</style>
</head>
<body>`

  printContent += generateHeader(documentData, formattedDateTime, companyInfo)
  printContent += generateBody(documentData.items)
  printContent += generateTotals(documentData)
  printContent += generateTVA(documentData.items)
  printContent += generatePaymentType({
    paymentType: documentData.paymentType,
    cashDetails: documentData.cashDetails,
    paymentDetails: documentData.paymentDetails,
    totalTTC: documentData.totalTTC,
    remainingAmount: documentData.remainingAmount,
    fontSize: '16px', // Vous pouvez ajuster la taille de la police si nécessaire
  })
  printContent += generateRemerciement()
  printContent += `<div style="text-align: center; margin-top: 20px;"><img src="${qrCodeDataURL}" alt="QR Code" style="width: 50px; height: 50px;"></div>`
  printContent += '</body></html>'

  sendPrintRequest(printContent)
}
