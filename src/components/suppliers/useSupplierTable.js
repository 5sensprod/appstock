import { useState } from 'react'
import { useSuppliers } from '../../contexts/SupplierContext'
import { useUI } from '../../contexts/UIContext'

export const useSupplierTable = () => {
  const { suppliers, createSupplier, modifySupplier, removeSupplier } =
    useSuppliers()
  const { showToast, showConfirmDialog } = useUI()
  const [open, setOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [supplierInfo, setSupplierInfo] = useState({
    _id: null,
    name: '',
    supplierCode: '',
    contact: '',
    email: '',
    phone: '',
    website: '',
    iban: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
    brands: [],
  })
  const [newBrand, setNewBrand] = useState('')

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleDetailsOpen = (supplier) => {
    setSelectedSupplier(supplier)
    setDetailsOpen(true)
  }
  const handleDetailsClose = () => setDetailsOpen(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSupplierInfo({ ...supplierInfo, [name]: value })
  }

  const handleAddOrUpdateSupplier = async () => {
    const supplierData = { ...supplierInfo }
    try {
      if (supplierData._id) {
        await modifySupplier(supplierData._id, supplierData)
        showToast('Fournisseur modifié avec succès', 'success')
      } else {
        delete supplierData._id // NeDB générera automatiquement un _id
        await createSupplier(supplierData)
        showToast('Fournisseur ajouté avec succès', 'success')
      }
      handleClose()
      resetSupplierInfo()
    } catch (error) {
      showToast("Erreur lors de l'enregistrement du fournisseur", 'error')
    }
  }

  const resetSupplierInfo = () => {
    setSupplierInfo({
      _id: null,
      name: '',
      supplierCode: '',
      contact: '',
      email: '',
      phone: '',
      website: '',
      iban: '',
      street: '',
      city: '',
      postalCode: '',
      country: '',
      brands: [],
    })
    setNewBrand('')
  }

  const handleEdit = (supplier) => {
    setSupplierInfo({
      ...supplier,
      _id: supplier._id,
      brands: supplier.brands || [],
    })
    handleOpen()
  }

  const handleDelete = async (id) => {
    showConfirmDialog(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer ce fournisseur ?',
      async () => {
        try {
          await removeSupplier(id)
          showToast('Fournisseur supprimé avec succès', 'success')
        } catch (error) {
          showToast('Erreur lors de la suppression du fournisseur', 'error')
        }
      },
    )
  }

  const handleAddBrand = () => {
    if (newBrand && !supplierInfo.brands.includes(newBrand)) {
      setSupplierInfo((prevInfo) => ({
        ...prevInfo,
        brands: [...prevInfo.brands, newBrand],
      }))
      setNewBrand('')
    }
  }

  const handleRemoveBrand = (index) => {
    setSupplierInfo((prevInfo) => ({
      ...prevInfo,
      brands: prevInfo.brands.filter((_, i) => i !== index),
    }))
  }

  return {
    suppliers,
    open,
    handleOpen,
    handleClose,
    detailsOpen,
    handleDetailsOpen,
    handleDetailsClose,
    selectedSupplier,
    supplierInfo,
    handleInputChange,
    handleAddOrUpdateSupplier,
    handleEdit,
    handleDelete,
    handleAddBrand,
    handleRemoveBrand,
    newBrand,
    setNewBrand,
  }
}
