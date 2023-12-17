import React, { useState } from 'react'
import { TreeView, TreeItem } from '@mui/x-tree-view'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const buildTree = (categories, parentId = null) => {
  return categories
    .filter((category) => category.parentId === parentId)
    .map((category) => ({
      ...category,
      children: buildTree(categories, category._id),
    }))
}
const CategoryTreeFilter = ({ categories, onCategorySelect }) => {
  const [expanded, setExpanded] = useState([])
  const renderTree = (node) => (
    <TreeItem key={node._id} nodeId={node._id} label={node.name}>
      {node.children && node.children.map((child) => renderTree(child))}
    </TreeItem>
  )

  const handleNodeSelect = (event, nodeId) => {
    let newExpanded
    if (expanded.includes(nodeId)) {
      newExpanded = expanded.filter((id) => id !== nodeId)
    } else {
      newExpanded = [...expanded, nodeId]
    }
    setExpanded(newExpanded)
    onCategorySelect(nodeId)
  }
  return (
    <TreeView
      expanded={expanded}
      onNodeToggle={(event, nodeIds) => setExpanded(nodeIds)}
      onNodeSelect={handleNodeSelect}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {buildTree(categories).map((category) => renderTree(category))}
    </TreeView>
  )
}

export default CategoryTreeFilter
