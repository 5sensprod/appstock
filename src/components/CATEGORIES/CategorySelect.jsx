import React, { useState } from 'react'
import { TextField, Popover } from '@mui/material'
import { TreeView } from '@mui/x-tree-view/TreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useCategoryContext } from '../../contexts/CategoryContext'

const CategorySelect = ({ value, onChange, size = 'small', label = '' }) => {
  const { categories, setCurrentCategoryId } = useCategoryContext()
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedCategoryName, setSelectedCategoryName] = useState(value)
  // Ouvre le popover
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  // Ferme le popover
  const handleClose = () => {
    setAnchorEl(null)
  }

  // Gère la sélection d'une catégorie
  const handleCategorySelect = (event, categoryId) => {
    // Empêcher le popover de se fermer lors d'un clic sur les chevrons
    if (event.target.closest('.MuiTreeItem-iconContainer')) {
      event.stopPropagation()
      return
    }

    const selectedCategory = categories.find((cat) => cat._id === categoryId)
    const categoryName = selectedCategory ? selectedCategory.name : ''
    setSelectedCategoryName(categoryName)

    setCurrentCategoryId(categoryId)
    onChange(categoryId) // Envoyez l'ID à DataGrid
    handleClose()
  }

  // Construit l'arbre des catégories
  const buildTree = (categories, parentId = null) => {
    const tree = categories
      .filter((category) => category.parentId === parentId)
      .map((category) => ({
        ...category,
        children: buildTree(categories, category._id),
      }))

    // Ajoutez l'option "Aucun" au début si le parent est null
    if (parentId === null) {
      tree.unshift({
        _id: '',
        name: 'Aucun',
        children: [],
      })
    }

    return tree
  }

  // Rendu de l'arbre
  const renderTree = (node) => (
    <TreeItem
      key={node._id}
      nodeId={node._id}
      label={node.name}
      onClick={(event) => handleCategorySelect(event, node._id)}
    >
      {node.children && node.children.map((child) => renderTree(child))}
    </TreeItem>
  )

  return (
    <div>
      <TextField
        size={size}
        label={label}
        variant="outlined"
        onClick={handleClick}
        value={selectedCategoryName}
        fullWidth
        InputProps={{
          readOnly: true,
        }}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {buildTree(categories).map((category) => renderTree(category))}
        </TreeView>
      </Popover>
    </div>
  )
}

export default CategorySelect
