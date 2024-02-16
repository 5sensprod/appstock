import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Box,
  TextField,
  FormControl,
  IconButton,
  Popover,
  Fab,
} from '@mui/material'
import { useCategoryContext } from '../../contexts/CategoryContext'
import CategoryTreeSelect from './CategoryTreeSelect'
import { transformCategoriesToTree } from '../../utils/transformCategoriesToTree'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { useUI } from '../../contexts/UIContext'

function CreateCategory() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()
  const { categories, addCategoryToContext } = useCategoryContext()
  const [selectedParentId, setSelectedParentId] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedParentName, setSelectedParentName] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const { showToast } = useUI()

  // Gestionnaire pour la mise à jour du nom de la catégorie
  const handleCategoryNameChange = (event) => {
    const name = event.target.value
    setCategoryName(name)
    setValue('name', name) // Mettre à jour la valeur dans react-hook-form
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
      await addCategoryToContext(categoryData)
      showToast('Catégorie ajoutée.', 'success')
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
          label="Ajouter une catégorie"
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
          onFocus={(event) => event.target.blur()}
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
