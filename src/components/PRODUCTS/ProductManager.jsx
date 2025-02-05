import React, { useContext } from 'react'
import { Box, Typography } from '@mui/material'
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
import { useUI } from '../../contexts/UIContext'
import GenerateCodesForm from './GenerateCodesForm'
import ProductToolbar from './toolbar/ProductToolbar'
import ProductGrid from './grid/ProductGrid'
import { useModals } from './hooks/useModals'
import { useProductExport } from './hooks/useProductExport'
import { useCodeGeneration } from './hooks/useCodeGeneration'
import { CategoryTreeSelectContext } from '../../contexts/CategoryTreeSelectContext'

const ProductManager = ({ selectedCategoryId }) => {
  const { products } = useProductContextSimplified()
  const { categories, getCategoryPath } = useCategoryContext()
  const { suppliers } = useSuppliers()
  const { gridPreferences, updatePreferences } = useGridPreferences()
  const { showToast } = useUI()
  const { generateCodesForProducts } = useCodeGeneration()
  const { selectedCategory } = useContext(CategoryTreeSelectContext)

  const {
    isExportModalOpen,
    isGenerateCodesModalOpen,
    handleExportModalOpen,
    handleExportModalClose,
    handleGenerateCodesModalOpen,
    handleGenerateCodesModalClose,
  } = useModals()

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

  const { formatExportData, exportToCsv, exportToPdf } = useProductExport(
    suppliers,
    getCategoryPath,
  )

  const filteredProducts = products.filter((product) => {
    if (!selectedCategoryId) return true
    return selectedCategory.selectedCategoryIds.includes(product.categorie)
  })

  const handlePaginationModelChange = (model) => {
    updatePreferences({
      paginationModel: model,
    })
  }

  const handleExportSubmit = ({ selectedFields, exportFormat }) => {
    const selectedProducts = products.filter((product) =>
      rowSelectionModel.includes(product._id),
    )

    const dataToExport = formatExportData(selectedProducts, selectedFields)

    if (exportFormat.csv) {
      exportToCsv(dataToExport)
    }

    if (exportFormat.pdf) {
      exportToPdf(dataToExport, availableFields)
    }

    showToast('Exportation réussie', 'success')
    handleExportModalClose()
  }

  const handleGenerateCodesSubmit = async ({ codeType, height }) => {
    const selectedProducts = products.filter((product) =>
      rowSelectionModel.includes(product._id),
    )

    const codesGenerated = await generateCodesForProducts(
      selectedProducts,
      codeType,
      height,
    )

    showToast(
      codesGenerated
        ? 'Images générées avec succès'
        : "Aucun code généré : les produits sélectionnés n'ont pas de gencode",
      codesGenerated ? 'success' : 'warning',
    )

    handleGenerateCodesModalClose()
  }

  const normalizedProducts = filteredProducts.map((product) => ({
    ...product,
    dateSoumission: product.dateSoumission?.$$date
      ? new Date(product.dateSoumission.$$date)
      : new Date(product.dateSoumission),
  }))

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
      <ProductToolbar
        onCreateClick={() => handleOpenModal()}
        onBulkEditClick={handleBulkEditModalOpen}
        onExportClick={handleExportModalOpen}
        onGenerateCodesClick={handleGenerateCodesModalOpen}
        hasSelection={rowSelectionModel.length > 0}
        hasMultipleSelection={rowSelectionModel.length > 1}
      />

      {filteredProducts.length === 0 ? (
        <Typography variant="h6">Aucun produit trouvé</Typography>
      ) : (
        <ProductGrid
          products={normalizedProducts}
          columns={columns}
          paginationModel={gridPreferences.paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          onSelectionChange={(newSelection) =>
            setRowSelectionModel(newSelection)
          }
          selectionModel={rowSelectionModel}
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
