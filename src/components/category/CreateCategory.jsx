import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { TextField, Button, FormControl, Popover } from '@mui/material'
import { useProductContext } from '../../contexts/ProductContext'
import CategoryTreeSelect from './CategoryTreeSelect'
import { transformCategoriesToTree } from '../../utils/transformCategoriesToTree'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'

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
  const [selectedParentName, setSelectedParentName] = useState('') // Nom de la catégorie parente sélectionnée

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
        parentId: selectedParentId,
      }
      await addCategory(categoryData)
      reset() // Réinitialiser les autres champs du formulaire

      // Réinitialiser la sélection de la catégorie parente
      setSelectedParentId('')
      setSelectedParentName('')
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error)
    }
  }

  const handleCategorySelect = (categoryId, categoryName) => {
    setSelectedParentId(categoryId)
    setSelectedParentName(categoryName || '') // S'assurer que cela ne devient pas undefined ou null
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
        />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Catégorie Parente"
          value={selectedParentName}
          onClick={handleParentTextFieldClick}
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
      <Button type="submit" variant="contained" color="primary">
        Ajouter la catégorie
      </Button>
    </form>
  )
}

export default CreateCategory
