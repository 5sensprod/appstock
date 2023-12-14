export const createCategoryMap = (categories) => {
  return categories.reduce((acc, category) => {
    acc[category._id] = category.name
    return acc
  }, {})
}

// Fonction pour formater les produits
export const formatProducts = (products, categoryMap) => {
  return products.map((product) => ({
    ...product,
    id: product._id,
    categorie: categoryMap[product.categorie] || product.categorie,
    sousCategorie: categoryMap[product.sousCategorie] || product.sousCategorie,
  }))
}
