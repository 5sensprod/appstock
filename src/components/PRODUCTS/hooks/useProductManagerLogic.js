import { useState } from 'react'
import { useProductContextSimplified } from '../../../contexts/ProductContextSimplified'
import { useUI } from '../../../contexts/UIContext'

export const useProductManagerLogic = () => {
  const {
    products,
    addProductToContext,
    updateProductInContext,
    bulkUpdateProductsInContext,
    deleteProductFromContext,
  } = useProductContextSimplified()
  const { showToast, showConfirmDialog } = useUI()

  const [isModalOpen, setModalOpen] = useState(false)
  const [isBulkEditModalOpen, setBulkEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [rowSelectionModel, setRowSelectionModel] = useState([])

  const handleOpenModal = (product = null) => {
    setEditingProduct(product)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingProduct(null)
  }

  const handleBulkEditModalOpen = () => {
    setBulkEditModalOpen(true)
  }

  const handleBulkEditModalClose = () => {
    setBulkEditModalOpen(false)
  }

  const handleProductSubmit = async (productData, setSortModel) => {
    try {
      if (editingProduct) {
        await updateProductInContext(editingProduct._id, productData)
        showToast('Produit modifié avec succès', 'success')
      } else {
        await addProductToContext(productData)
        showToast('Produit ajouté avec succès', 'success')
      }
      setSortModel([{ field: 'dateSoumission', sort: 'desc' }])
      handleCloseModal()
    } catch (error) {
      showToast(
        "Erreur lors de l'ajout ou de la modification du produit",
        'error',
      )
    }
  }

  const handleBulkEditSubmit = async (updates) => {
    try {
      await bulkUpdateProductsInContext(updates)
      showToast('Produits modifiés avec succès', 'success')
      handleBulkEditModalClose()
    } catch (error) {
      showToast('Erreur lors de la modification des produits', 'error')
    }
  }

  const handleDeleteProduct = (productId) => {
    showConfirmDialog(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer ce produit ?',
      async () => {
        try {
          await deleteProductFromContext(productId)
          showToast('Produit supprimé avec succès', 'success')
        } catch (error) {
          showToast('Erreur lors de la suppression du produit', 'error')
        }
      },
    )
  }

  const handleDuplicateProduct = async () => {
    const productToDuplicate = products.find(
      (product) => product._id === rowSelectionModel[0],
    )

    if (productToDuplicate) {
      const duplicatedProduct = {
        ...productToDuplicate,
        _id: undefined,
        reference: `${productToDuplicate.reference}-COPY`,
        gencode: '', // Réinitialiser le gencode
        dateSoumission: new Date(),
        stock: 0, // Réinitialiser le stock
      }

      handleOpenModal(duplicatedProduct)
    }
  }

  return {
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
    handleDuplicateProduct,
  }
}
