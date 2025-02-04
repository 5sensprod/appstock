import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatPriceFrench } from '../../../utils/priceUtils'
import { formatDateFrench } from '../../../utils/dateUtils'

export const useProductExport = (suppliers, getCategoryPath) => {
  const formatExportData = (selectedProducts, selectedFields) => {
    return selectedProducts.map((product) => {
      const filteredProduct = {}
      for (const field in selectedFields) {
        if (selectedFields[field]) {
          if (field === 'supplierName') {
            const supplier = suppliers.find(
              (sup) => sup._id === product.supplierId,
            )
            filteredProduct[field] = supplier ? supplier.name : ''
          } else if (field === 'categorie') {
            filteredProduct[field] = getCategoryPath(product.categorie) || ''
          } else if (['prixAchat', 'prixVente', 'marge'].includes(field)) {
            filteredProduct[field] = formatPriceFrench(product[field])
          } else if (field === 'dateSoumission') {
            filteredProduct[field] = formatDateFrench(product[field])
          } else {
            filteredProduct[field] = product[field]
          }
        }
      }
      return filteredProduct
    })
  }

  const exportToCsv = (data) => {
    const csvRows = []
    const headers = Object.keys(data[0])
    csvRows.push(headers.join(';'))

    data.forEach((row) => {
      const values = headers.map((header) => {
        const value = row[header] !== undefined ? row[header] : ''
        const escaped = ('' + value).replace(/"/g, '\\"')
        return `"${escaped}"`
      })
      csvRows.push(values.join(';'))
    })

    const csvString = csvRows.join('\n')
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'export_produits.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPdf = (data, availableFields) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      margins: { top: 5, right: 5, bottom: 5, left: 5 },
    })

    doc.setFontSize(18)
    doc.text('Export des Produits', 14, 22)

    const exportDate = formatDateFrench(new Date())
    doc.setFontSize(12)
    doc.text(`Date d'exportation : ${exportDate}`, 14, 30)

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)

    const headers = [Object.keys(data[0]).map((key) => availableFields[key])]
    const rows = data.map((row) => Object.keys(data[0]).map((key) => row[key]))

    doc.autoTable({
      startY: 25,
      margin: { top: 5, right: 5, bottom: 5, left: 5 },
      head: headers,
      body: rows,
    })

    doc.save('export_produits.pdf')
  }

  return {
    formatExportData,
    exportToCsv,
    exportToPdf,
  }
}
