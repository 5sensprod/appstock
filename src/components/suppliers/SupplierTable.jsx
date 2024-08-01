import React, { useState } from 'react'
import { DataGrid, frFR, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { useSuppliers } from '../../contexts/SupplierContext'
import { useUI } from '../../contexts/UIContext'
import { IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import SupplierColumns from './SupplierColumns'
import SupplierForm from './SupplierForm'
import SupplierDetailsModal from './SupplierDetailsModal'

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f0f0f0',
          },
        },
      },
      defaultProps: {
        localeText: frFR.components.MuiDataGrid.defaultProps.localeText,
      },
    },
  },
})

const SupplierTable = () => {
  const { suppliers, createSupplier, modifySupplier, removeSupplier } =
    useSuppliers()
  const { showToast, showConfirmDialog } = useUI()
  const [open, setOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [supplierInfo, setSupplierInfo] = useState({
    _id: null,
    name: '',
    contact: '',
    email: '',
    phone: '',
    iban: '',
    address: '',
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
        delete supplierData._id // Supprimez l'_id pour permettre à NeDB de le générer automatiquement
        await createSupplier(supplierData)
        showToast('Fournisseur ajouté avec succès', 'success')
      }
      handleClose()
      setSupplierInfo({
        _id: null,
        name: '',
        contact: '',
        email: '',
        phone: '',
        iban: '',
        address: '',
        brands: [],
      })
      setNewBrand('')
    } catch (error) {
      showToast("Erreur lors de l'enregistrement du fournisseur", 'error')
    }
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

  const columns = SupplierColumns(handleEdit, handleDelete, handleDetailsOpen)

  return (
    <ThemeProvider theme={theme}>
      <div>
        <IconButton onClick={handleOpen}>
          <AddIcon />
        </IconButton>
        <div style={{ width: 'fit-content' }}>
          <DataGrid
            localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
            rows={suppliers}
            columns={columns}
            pageSize={5}
            getRowId={(row) => row._id}
            components={{ Toolbar: GridToolbarQuickFilter }}
          />
        </div>
        <SupplierForm
          open={open}
          handleClose={handleClose}
          supplierInfo={supplierInfo}
          handleInputChange={handleInputChange}
          handleAddOrUpdateSupplier={handleAddOrUpdateSupplier}
          handleAddBrand={handleAddBrand}
          handleRemoveBrand={handleRemoveBrand}
          newBrand={newBrand}
          setNewBrand={setNewBrand}
        />
        <SupplierDetailsModal
          open={detailsOpen}
          handleClose={handleDetailsClose}
          supplier={selectedSupplier}
        />
      </div>
    </ThemeProvider>
  )
}

export default SupplierTable
