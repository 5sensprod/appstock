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

const ProductManager = ({ selectedCategoryId }) => {
  const { products } = useProductContextSimplified() // Récupération des produits depuis le contexte
  const { categories } = useCategoryContext()
  const { suppliers } = useSuppliers()
  const { gridPreferences, updatePreferences } = useGridPreferences() // Récupérer et mettre à jour les préférences de grille
  const { showToast } = useUI()
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

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

  const availableFields = {
    reference: 'Référence',
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
    </Box>
  )
}

export default ProductManager
