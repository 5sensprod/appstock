import React, { useState, useEffect } from 'react'
import { TextField, Popover, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { TreeView } from '@mui/x-tree-view/TreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useCategoryContext } from '../../contexts/CategoryContext'

const CategoryFilter = ({ onCategorySelect, selectedCategoryId }) => {
  const { categories } = useCategoryContext()
  const [anchorEl, setAnchorEl] = useState(null)
  const [filterText, setFilterText] = useState('')
  const [selectedCategoryName, setSelectedCategoryName] = useState('')

  useEffect(() => {
    if (selectedCategoryId) {
      const selectedCategory = categories.find(
        (cat) => cat._id === selectedCategoryId,
      )
      setSelectedCategoryName(selectedCategory ? selectedCategory.name : '')
    }
  }, [selectedCategoryId, categories])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const clearCategorySelection = (event) => {
    event.stopPropagation()
    setSelectedCategoryName('')
    setFilterText('')
    onCategorySelect(null)
  }

  const handleCategorySelect = (event, categoryId) => {
    // Empêcher le popover de se fermer lors d'un clic sur les chevrons
    if (event.target.closest('.MuiTreeItem-iconContainer')) {
      return
    }

    const selectedCategory = categories.find((cat) => cat._id === categoryId)
    setSelectedCategoryName(selectedCategory ? selectedCategory.name : '')
    setFilterText('')
    onCategorySelect(categoryId)
    handleClose()
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(filterText.toLowerCase()),
  )

  const buildTree = (categories, parentId = null) => {
    return categories
      .filter((category) => category.parentId === parentId)
      .map((category) => ({
        ...category,
        children: buildTree(categories, category._id),
      }))
  }

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
        size="small"
        label="Filtrer par catégorie"
        variant="outlined"
        onClick={handleClick}
        value={selectedCategoryName}
        onChange={(e) => setFilterText(e.target.value)}
        fullWidth
        style={{ marginBottom: 8 }}
        InputProps={{
          readOnly: true,
          endAdornment: selectedCategoryName ? (
            <IconButton onClick={clearCategorySelection}>
              <CloseIcon />
            </IconButton>
          ) : null,
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
          {buildTree(filteredCategories).map((category) =>
            renderTree(category),
          )}
        </TreeView>
      </Popover>
    </div>
  )
}

export default CategoryFilter
