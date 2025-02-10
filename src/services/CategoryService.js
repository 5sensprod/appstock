// src/services/CategoryService.js
class CategoryService {
  constructor(categoryRepository, wooCommerceClient) {
    this.categoryRepository = categoryRepository
    this.wooCommerceClient = wooCommerceClient
  }

  async syncFromWooCommerce() {
    try {
      // Récupérer les catégories de WooCommerce
      const response = await this.wooCommerceClient.get('products/categories')
      // Accéder au tableau de catégories via response.data
      const wooCategories = response.data

      for (const wooCat of wooCategories) {
        const existingCategory = await this.categoryRepository.findByWooId(
          wooCat.id,
        )
        const categoryData = {
          name: wooCat.name,
          parent_id: wooCat.parent || null,
          woo_id: wooCat.id,
          slug: wooCat.slug,
          description: wooCat.description,
          image: wooCat.image
            ? {
                id: wooCat.image.id,
                src: wooCat.image.src,
                local_path: null,
              }
            : null,
          level: await this.calculateLevel(wooCat.parent),
          website_url: wooCat.permalink,
        }
        if (existingCategory) {
          await this.categoryRepository.update(
            existingCategory._id,
            categoryData,
          )
        } else {
          await this.categoryRepository.create(categoryData)
        }
      }
    } catch (error) {
      throw new Error(`Sync failed: ${error.message}`)
    }
  }

  async pushToWooCommerce(categoryId) {
    const category = await this.categoryRepository.findById(categoryId)
    if (!category) throw new Error('Category not found')

    // Modifions le format des données pour WooCommerce
    const wooData = {
      name: category.name,
      description: category.description || '', // Assurons-nous d'avoir une chaîne vide si null
      slug: category.slug || undefined, // WooCommerce générera le slug si non fourni
      parent: category.parent_id || 0, // WooCommerce attend 0 pour pas de parent
    }

    try {
      if (category.woo_id) {
        const response = await this.wooCommerceClient.put(
          `products/categories/${category.woo_id}`,
          wooData,
        )
        return response.data
      } else {
        const response = await this.wooCommerceClient.post(
          'products/categories',
          wooData,
        )
        // Mise à jour de l'ID WooCommerce dans la base locale
        await this.categoryRepository.update(categoryId, {
          woo_id: response.data.id,
        })
        return response.data
      }
    } catch (error) {
      // Améliorons le message d'erreur
      if (error.response) {
        console.error('WooCommerce error details:', error.response.data)
        throw new Error(
          `WooCommerce sync failed: ${JSON.stringify(error.response.data)}`,
        )
      }
      throw new Error(`WooCommerce sync failed: ${error.message}`)
    }
  }
  async calculateLevel(parentId) {
    if (!parentId) return 0
    const parent = await this.categoryRepository.findByWooId(parentId)
    return parent ? parent.level + 1 : 0
  }

  async getHierarchy() {
    const categories = await this.categoryRepository.list()
    return this.buildHierarchyTree(categories)
  }

  buildHierarchyTree(categories, parentId = null) {
    return categories
      .filter((cat) => cat.parent_id === parentId)
      .map((cat) => ({
        ...cat,
        children: this.buildHierarchyTree(categories, cat._id),
      }))
  }
}

module.exports = CategoryService
