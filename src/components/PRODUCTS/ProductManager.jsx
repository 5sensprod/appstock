import React, { useState } from 'react'
import {
  DataGridPremium,
  frFR,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium'
import { Box, Typography, Button } from '@mui/material'
import { useCategoryContext } from '../../contexts/CategoryContext'
import { useSuppliers } from '../../contexts/SupplierContext'
import useProductManagerColumns from './hooks/useProductManagerColumns'
import ProductForm from './ProductForm'
import BulkEditForm from './BulkEditForm'
import ReusableModal from '../ui/ReusableModal'
import { useProductManagerLogic } from './hooks/useProductManagerLogic'
import { useProductContextSimplified } from '../../contexts/ProductContextSimplified'
import { useGridPreferences } from '../../contexts/GridPreferenceContext'
import ExportForm from './ExportForm'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatPriceFrench } from '../../utils/priceUtils'
import { formatDateFrench } from '../../utils/dateUtils'
import { useUI } from '../../contexts/UIContext'
import GenerateCodesForm from './GenerateCodesForm'
import html2canvas from 'html2canvas'

import JsBarcode from 'jsbarcode'
import { QRCodeCanvas } from 'qrcode.react'
import { createRoot } from 'react-dom/client'

const ProductManager = ({ selectedCategoryId }) => {
  const { products } = useProductContextSimplified() // Récupération des produits depuis le contexte
  const { categories } = useCategoryContext()
  const { suppliers } = useSuppliers()
  const { gridPreferences, updatePreferences } = useGridPreferences() // Récupérer et mettre à jour les préférences de grille
  const { showToast } = useUI()
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  const [isGenerateCodesModalOpen, setIsGenerateCodesModalOpen] =
    useState(false)

  const handleGenerateCodesModalOpen = () => {
    setIsGenerateCodesModalOpen(true)
  }

  const handleGenerateCodesModalClose = () => {
    setIsGenerateCodesModalOpen(false)
  }

  const handleExportModalOpen = () => {
    setIsExportModalOpen(true)
  }

  const handleExportModalClose = () => {
    setIsExportModalOpen(false)
  }

  const {
    isModalOpen,
    isBulkEditModalOpen,
    editingProduct,
    rowSelectionModel,
    handleOpenModal,
    handleCloseModal,
    handleBulkEditModalOpen,
    handleBulkEditModalClose,
    handleProductSubmit,
    handleBulkEditSubmit,
    handleDeleteProduct,
    setRowSelectionModel,
  } = useProductManagerLogic()

  const columns = useProductManagerColumns({
    categories,
    suppliers,
    handleOpenModal,
    handleDeleteProduct,
  })

  const filteredProducts = products.filter((product) => {
    if (!selectedCategoryId) return true
    return product.categorie === selectedCategoryId
  })

  const handlePaginationModelChange = (model) => {
    updatePreferences({
      paginationModel: model,
    })
  }

  const exportToCsv = (data) => {
    // Convertir les données en CSV
    const csvRows = []

    // Récupérer les en-têtes
    const headers = Object.keys(data[0])
    csvRows.push(headers.join(';')) // Utiliser ';' comme séparateur pour CSV français

    // Ajouter les données
    data.forEach((row) => {
      const values = headers.map((header) => {
        const value = row[header] !== undefined ? row[header] : ''
        const escaped = ('' + value).replace(/"/g, '\\"') // Échapper les guillemets
        return `"${escaped}"` // Encadrer chaque valeur par des guillemets
      })
      csvRows.push(values.join(';'))
    })

    // Créer le Blob et le télécharger
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

  const exportToPdf = (data) => {
    const doc = new jsPDF()

    // Ajouter un titre au PDF
    doc.setFontSize(18)
    doc.text('Export des Produits', 14, 22)

    // Ajouter la date d'exportation
    const exportDate = formatDateFrench(new Date())
    doc.setFontSize(12)
    doc.text(`Date d'exportation : ${exportDate}`, 14, 30)

    // Ajouter un espace avant le tableau
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)

    // Récupérer les en-têtes
    const headers = [Object.keys(data[0]).map((key) => availableFields[key])]

    // Récupérer les données
    const rows = data.map((row) => Object.keys(data[0]).map((key) => row[key]))

    // Ajouter le tableau au PDF
    doc.autoTable({
      startY: 35, // Positionner le tableau en dessous du titre
      head: headers,
      body: rows,
    })

    // Enregistrer le PDF
    doc.save('export_produits.pdf')
  }

  const handleExportSubmit = ({ selectedFields, exportFormat }) => {
    // Récupérer les produits sélectionnés
    const selectedProducts = products.filter((product) =>
      rowSelectionModel.includes(product._id),
    )

    // Filtrer et formater les champs des produits sélectionnés
    const dataToExport = selectedProducts.map((product) => {
      const filteredProduct = {}
      for (const field in selectedFields) {
        if (selectedFields[field]) {
          // Gestion spéciale pour le nom du fournisseur
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

    // Exporter en CSV
    if (exportFormat.csv) {
      exportToCsv(dataToExport)
    }

    // Exporter en PDF
    if (exportFormat.pdf) {
      exportToPdf(dataToExport)
    }

    // Afficher une notification de succès
    showToast('Exportation réussie', 'success')

    // Fermer le modal
    handleExportModalClose()
  }

  const handleGenerateCodesSubmit = async ({ codeType, height }) => {
    const heightInPixels = height * 3.7795275591

    // Récupérer les produits sélectionnés
    const selectedProducts = products.filter((product) =>
      rowSelectionModel.includes(product._id),
    )

    let codesGenerated = false

    for (const product of selectedProducts) {
      const gencode = product.gencode || ''
      if (!gencode) {
        continue
      }

      codesGenerated = true

      const fileName = `${product.reference || 'produit'}_${gencode}_${codeType}.png`

      let codeElement

      if (codeType === 'barcode') {
        // Créer un canvas pour le code-barres
        const canvas = document.createElement('canvas')
        JsBarcode(canvas, gencode, {
          format: 'CODE128',
          height: heightInPixels,
          displayValue: true,
        })
        codeElement = canvas
      } else {
        // Utiliser QRCodeCanvas pour le QR code
        codeElement = (
          <QRCodeCanvas
            id="qrCode"
            value={gencode}
            size={heightInPixels}
            includeMargin={true}
          />
        )
      }

      // Convertir l'élément en image
      await generateImageFromElement(codeElement, fileName)
    }

    if (codesGenerated) {
      showToast('Images générées avec succès', 'success')
    } else {
      showToast(
        "Aucun code généré : les produits sélectionnés n'ont pas de gencode",
        'warning',
      )
    }

    // Fermer le modal
    handleGenerateCodesModalClose()
  }

  const generateImageFromElement = async (element, fileName) => {
    // Créer un conteneur div pour l'élément
    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.top = '-10000px' // Hors de la vue
    document.body.appendChild(container)

    // Ajouter l'élément au conteneur
    if (element instanceof HTMLCanvasElement) {
      container.appendChild(element)
    } else {
      // Rendre l'élément React dans le conteneur
      const root = createRoot(container)
      root.render(element)
      // Attendre que le composant soit rendu
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    // Utiliser html2canvas pour convertir en image
    const canvas = await html2canvas(container, {
      backgroundColor: null,
      scale: 2, // Meilleure résolution
    })

    // Convertir le canvas en Data URL
    const dataUrl = canvas.toDataURL('image/png')

    // Créer un lien pour le téléchargement
    const link = document.createElement('a')
    link.href = dataUrl
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Nettoyer le conteneur
    document.body.removeChild(container)
  }

  const availableFields = {
    reference: 'Référence',
    designation: 'Désignation',
    prixAchat: "Prix d'Achat",
    marge: 'Marge (%)',
    prixVente: 'Prix de Vente',
    stock: 'Stock',
    categorie: 'Catégorie',
    supplierName: 'Fournisseur',
    marque: 'Marque',
    gencode: 'Gencode',
    tva: 'TVA',
    dateSoumission: "Date d'Ajout",
  }

  return (
    <Box>
      <Box mb={2} mt={1}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal()}
        >
          Créer un produit
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleBulkEditModalOpen}
          disabled={rowSelectionModel.length < 2}
          style={{ marginLeft: 16 }}
        >
          Modifier en masse
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleExportModalOpen}
          disabled={rowSelectionModel.length < 1}
          style={{ marginLeft: 16 }}
        >
          Exporter
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleGenerateCodesModalOpen}
          disabled={rowSelectionModel.length < 1}
          style={{ marginLeft: 16 }}
        >
          Générer Codes
        </Button>
      </Box>

      {filteredProducts.length === 0 ? (
        <Typography variant="h6">Aucun produit trouvé</Typography>
      ) : (
        <DataGridPremium
          rows={filteredProducts}
          columns={columns}
          paginationModel={gridPreferences.paginationModel} // Utilisation des préférences pour la pagination
          onPaginationModelChange={handlePaginationModelChange} // Met à jour les préférences dans le contexte
          pageSize={gridPreferences.paginationModel.pageSize} // Taille de page depuis les préférences
          onPageSizeChange={(newPageSize) => {
            handlePaginationModelChange({
              ...gridPreferences.paginationModel,
              pageSize: newPageSize,
            })
          }}
          pageSizeOptions={[10, 25, 50]} // Options de taille de page
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          slots={{ toolbar: GridToolbarQuickFilter }}
          getRowId={(row) => row._id}
          pagination
          checkboxSelection
          disableRowSelectionOnClick // Désactiver la sélection des lignes lors du clic
          onRowSelectionModelChange={(newSelection) =>
            setRowSelectionModel(newSelection)
          }
          rowSelectionModel={rowSelectionModel}
          initialState={{
            sorting: {
              sortModel: [{ field: 'dateSoumission', sort: 'desc' }], // Trier par défaut par date décroissante
            },
          }}
        />
      )}

      <ReusableModal open={isModalOpen} onClose={handleCloseModal}>
        <Typography variant="h5" mb={2}>
          {editingProduct ? 'Modifier le produit' : 'Créer un produit'}
        </Typography>
        <ProductForm
          initialProduct={
            editingProduct || {
              reference: '',
              marque: '',
              prixAchat: 0,
              prixVente: 0,
              stock: 0,
              gencode: '',
              categorie: '',
              supplierId: '',
              tva: 20,
            }
          }
          onSubmit={handleProductSubmit}
          onCancel={handleCloseModal}
        />
      </ReusableModal>

      <ReusableModal
        open={isBulkEditModalOpen}
        onClose={handleBulkEditModalClose}
      >
        <Typography variant="h6">Modifier les produits sélectionnés</Typography>
        <BulkEditForm
          onSubmit={handleBulkEditSubmit}
          onCancel={handleBulkEditModalClose}
          selectedProducts={rowSelectionModel}
        />
      </ReusableModal>

      <ReusableModal open={isExportModalOpen} onClose={handleExportModalClose}>
        <ExportForm
          onSubmit={handleExportSubmit}
          onCancel={handleExportModalClose}
          availableFields={availableFields}
        />
      </ReusableModal>

      <ReusableModal
        open={isGenerateCodesModalOpen}
        onClose={handleGenerateCodesModalClose}
      >
        <GenerateCodesForm
          onSubmit={handleGenerateCodesSubmit}
          onCancel={handleGenerateCodesModalClose}
        />
      </ReusableModal>
    </Box>
  )
}

export default ProductManager
