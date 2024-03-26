import { sendPrintRequest } from '../../ipcHelper'
import { generateHeader } from './generateHeader'
import { generateBody } from './generateBody'
import { generateTotals } from './generateTotal'
import { generateTVA } from './generateTVA'
import moment from 'moment'
import 'moment/locale/fr'

export const printTicket = async (documentData, documentType, companyInfo) => {
  moment.locale('fr') // Configure le locale de Moment.js à français

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
  printContent += '</body></html>'

  sendPrintRequest(printContent)
}
