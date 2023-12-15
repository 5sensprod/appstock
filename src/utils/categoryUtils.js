export const transformCategoriesToGridData = (categories) => {
  // Créer un objet pour accéder rapidement aux catégories par leur ID
  let categoriesMap = categories.reduce((acc, category) => {
    acc[category._id] = { ...category, children: [] }
    return acc
  }, {})

  // Construire la structure d'arbre
  let tree = []
  categories.forEach((category) => {
    if (category.parentId) {
      // Si c'est une sous-catégorie, ajoutez-la au parent correspondant
      if (categoriesMap[category.parentId]) {
        categoriesMap[category.parentId].children.push(
          categoriesMap[category._id],
        )
      }
    } else {
      // Si c'est une catégorie parente, ajoutez-la à l'arbre
      tree.push(categoriesMap[category._id])
    }
  })

  // Transformer l'arbre en format compatible avec AG-Grid
  const transformNode = (node, path = []) => {
    const nodePath = [...path, node.name]
    const transformedNode = {
      ...node,
      path: nodePath,
    }

    if (node.children.length > 0) {
      transformedNode.children = node.children.map((child) =>
        transformNode(child, nodePath),
      )
    } else {
      delete transformedNode.children
    }

    return transformedNode
  }

  return tree.map((rootNode) => transformNode(rootNode))
}

export const buildCategoryPath = (category, idToCategoryMap) => {
  let path = [category.name]
  let current = category
  while (current.parentId && idToCategoryMap[current.parentId]) {
    current = idToCategoryMap[current.parentId]
    path.unshift(current.name)
  }
  return path
}

export const findAllChildCategories = (categoryId, categories) => {
  const childCategories = categories.filter(
    (cat) => cat.parentId === categoryId,
  )
  return childCategories.reduce((acc, cat) => {
    return [...acc, cat, ...findAllChildCategories(cat._id, categories)]
  }, [])
}
