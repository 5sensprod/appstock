import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Box,
  TextField,
  Button,
  FormControl,
  IconButton,
  Popover,
  Fab,
} from '@mui/material'
import { useProductContext } from '../../contexts/ProductContext'
import CategoryTreeSelect from './CategoryTreeSelect'
import { transformCategoriesToTree } from '../../utils/transformCategoriesToTree'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'

function CreateCategory() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const { addCategory, categories } = useProductContext()
  const [selectedParentId, setSelectedParentId] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedParentName, setSelectedParentName] = useState('')
  const [categoryName, setCategoryName] = useState('') // État pour le nom de la catégorie

  // Gestionnaire pour la mise à jour du nom de la catégorie
  const handleCategoryNameChange = (event) => {
    setCategoryName(event.target.value)
  }

  // Fonction pour effacer la sélection de la catégorie
  const clearCategorySelection = (event) => {
    // Empêcher la propagation de l'événement pour éviter de déclencher l'ouverture du popover
    event.stopPropagation()

    setSelectedParentId('')
    setSelectedParentName('')
  }

  const onSubmit = async (data) => {
    try {
      const categoryData = {
        ...data,
        parentId: selectedParentId === '' ? null : selectedParentId,
      }
      await addCategory(categoryData)
      reset()
      setSelectedParentId('')
      setSelectedParentName('')
      setCategoryName('')
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error)
    }
  }

  const handleCategorySelect = (categoryId, categoryName) => {
    setSelectedParentId(categoryId)
    setSelectedParentName(categoryName || '')
    setAnchorEl(null)
  }
  const handleParentTextFieldClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'category-popover' : undefined
  const categoryTree = transformCategoriesToTree(categories)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth margin="normal">
        <TextField
          {...register('name', { required: true })}
          label="Nom de la catégorie"
          error={!!errors.name}
          helperText={errors.name ? 'Ce champ est requis' : null}
          size="small"
          value={categoryName}
          onChange={handleCategoryNameChange}
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Catégorie Parente"
          value={selectedParentName}
          onClick={handleParentTextFieldClick}
          size="small"
          InputProps={{
            readOnly: true,
            endAdornment: selectedParentName ? (
              <IconButton onClick={(event) => clearCategorySelection(event)}>
                <CloseIcon />
              </IconButton>
            ) : null,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          onFocus={(event) => event.target.blur()} // Empêcher le focus
        />
      </FormControl>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <CategoryTreeSelect
          categories={categoryTree}
          onCategorySelect={(id, name) => handleCategorySelect(id, name)}
        />
      </Popover>
      <Box display="flex" justifyContent="center" marginY={2}>
        <Fab
          color="primary"
          size="small"
          type="submit"
          disabled={!categoryName}
        >
          <AddIcon />
        </Fab>
      </Box>
    </form>
  )
}

export default CreateCategory
