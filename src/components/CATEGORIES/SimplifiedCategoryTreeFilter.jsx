import React, { useState, useEffect } from 'react'
import { TreeView, TreeItem } from '@mui/x-tree-view'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useCategoryContext } from '../../contexts/CategoryContext'

const buildTree = (categories, parentId = null) => {
  return categories
    .filter((category) => category.parentId === parentId)
    .map((category) => ({
      ...category,
      children: buildTree(categories, category._id),
    }))
}

const SimplifiedCategoryTreeFilter = ({
  onCategorySelect,
  selectedCategoryId,
}) => {
  const [expanded, setExpanded] = useState([])
  const [selected, setSelected] = useState('')
  const { categories, productCountByCategory } = useCategoryContext()

  useEffect(() => {
    if (selectedCategoryId) {
      setSelected(selectedCategoryId)
      // La logique pour définir `expanded` peut être ajoutée ici si nécessaire
    }
  }, [selectedCategoryId])

  const handleNodeSelect = (event, nodeId) => {
    if (nodeId === 'all') {
      onCategorySelect(null) // Indiquez que "Toutes les catégories" a été sélectionné
    } else {
      setSelected(nodeId)
      onCategorySelect(nodeId)
    }
  }

  const renderTree = (node) => {
    const productCount = productCountByCategory[node._id] || 0
    const isDisabled = productCount === 0 // Vérifiez si la catégorie doit être désactivée

    return (
      <TreeItem
        key={node._id}
        nodeId={node._id}
        label={`${node.name} (${productCount})`}
        style={{ color: isDisabled ? 'gray' : 'inherit' }} // Griser l'élément si désactivé
        disabled={isDisabled} // Désactiver la sélection si aucun produit
      >
        {node.children && node.children.map((child) => renderTree(child))}
      </TreeItem>
    )
  }

  return (
    <TreeView
      expanded={expanded}
      selected={selected}
      onNodeToggle={(event, nodeIds) => setExpanded(nodeIds)}
      onNodeSelect={handleNodeSelect}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {/* Ajoutez une option pour 'Toutes les catégories' */}
      <TreeItem
        nodeId="all"
        label="Toutes les catégories"
        onClick={() => handleNodeSelect(null, 'all')}
      />
      {buildTree(categories).map((category) => renderTree(category))}
    </TreeView>
  )
}

export default SimplifiedCategoryTreeFilter
