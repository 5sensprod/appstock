export const transformCategoriesToTree = (categories) => {
  // Créer une copie des catégories pour éviter de modifier les données d'origine
  let categoriesCopy = categories.map((category) => ({ ...category }))

  // Créer un objet pour accéder rapidement aux catégories par leur ID
  let categoriesMap = categoriesCopy.reduce((acc, category) => {
    acc[category._id] = category
    category.children = []
    return acc
  }, {})

  // Construire la structure d'arbre
  let tree = []
  categoriesCopy.forEach((category) => {
    if (category.parentId) {
      categoriesMap[category.parentId].children.push(category)
    } else {
      tree.push(category)
    }
  })

  return tree
}
