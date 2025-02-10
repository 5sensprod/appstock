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
      const wooCategories = response.data

      // Première passe : créer ou mettre à jour toutes les catégories
      const wooToLocalMap = new Map() // Pour stocker la correspondance woo_id -> _id local

      for (const wooCat of wooCategories) {
        const existingCategory = await this.categoryRepository.findByWooId(
          wooCat.id,
        )

        const categoryData = {
          name: wooCat.name,
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
          website_url: wooCat.permalink,
          // On ne définit pas encore parent_id et level
          parent_id: null,
          level: 0,
        }

        let localCategory
        if (existingCategory) {
          localCategory = await this.categoryRepository.update(
            existingCategory._id,
            categoryData,
          )
        } else {
          localCategory = await this.categoryRepository.create(categoryData)
        }

        wooToLocalMap.set(wooCat.id, localCategory._id)
      }

      // Deuxième passe : mettre à jour les relations parent/enfant
      for (const wooCat of wooCategories) {
        if (wooCat.parent) {
          const localCategoryId = wooToLocalMap.get(wooCat.id)
          const localParentId = wooToLocalMap.get(wooCat.parent)

          if (localCategoryId && localParentId) {
            const level = await this.calculateLevel(localParentId)
            await this.categoryRepository.update(localCategoryId, {
              parent_id: localParentId,
              level: level + 1,
            })
          }
        }
      }
    } catch (error) {
      throw new Error(`Sync failed: ${error.message}`)
    }
  }

  async calculateLevel(localParentId) {
    if (!localParentId) return 0
    const parent = await this.categoryRepository.findById(localParentId)
    return parent ? parent.level + 1 : 0
  }

  async pushToWooCommerce(categoryId) {
    const category = await this.categoryRepository.findById(categoryId)
    if (!category) throw new Error('Category not found')

    let parentWooId = 0
    if (category.parent_id) {
      const parentCategory = await this.categoryRepository.findById(
        category.parent_id,
      )
      if (parentCategory && parentCategory.woo_id) {
        parentWooId = parentCategory.woo_id
      }
    }

    const wooData = {
      name: category.name,
      description: category.description || '',
      slug: category.slug || undefined,
      parent: parentWooId,
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
        await this.categoryRepository.update(categoryId, {
          woo_id: response.data.id,
        })
        return response.data
      }
    } catch (error) {
      if (error.response) {
        console.error('WooCommerce error details:', error.response.data)
        throw new Error(
          `WooCommerce sync failed: ${JSON.stringify(error.response.data)}`,
        )
      }
      throw new Error(`WooCommerce sync failed: ${error.message}`)
    }
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
