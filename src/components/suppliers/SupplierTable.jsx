import React from 'react'
import { DataGrid, frFR, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import SupplierColumns from './SupplierColumns'
import SupplierForm from './SupplierForm'
import SupplierDetailsModal from './SupplierDetailsModal'
import { useSupplierTable } from './useSupplierTable'

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
  const {
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
  } = useSupplierTable()

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
            initialState={{
              sorting: {
                sortModel: [{ field: 'name', sort: 'asc' }],
              },
            }}
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
