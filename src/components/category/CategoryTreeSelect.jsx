import React from 'react'
import { TreeView } from '@mui/x-tree-view/TreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const CategoryTreeSelect = ({ categories, onCategorySelect }) => {
  const handleTreeItemClick = (event, categoryId, categoryName) => {
    // Vérifier si l'élément cliqué est une icône d'expansion
    if (event.target.closest('.MuiTreeItem-iconContainer')) {
      // C'est une icône d'expansion, ne faites rien
      return
    }

    // Appeler onCategorySelect uniquement si l'utilisateur clique sur le label de l'item
    if (event.target.closest('.MuiTreeItem-content')) {
      event.stopPropagation() // Empêcher la propagation de l'événement
      onCategorySelect(categoryId, categoryName)
    }
  }

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes._id}
      nodeId={nodes._id}
      label={nodes.name}
      onClick={(event) => handleTreeItemClick(event, nodes._id, nodes.name)}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  )

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {categories.map((category) => renderTree(category))}
    </TreeView>
  )
}

export default CategoryTreeSelect
