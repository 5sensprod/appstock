// src/services/CategoryService.js
class CategoryService {
  constructor(categoryRepository, wooCommerceClient) {
    this.categoryRepository = categoryRepository
    this.wooCommerceClient = wooCommerceClient
  }

  async syncFromWooCommerce() {
    try {
      const wooCategories = await this.wooCommerceClient.get(
        'products/categories',
      )

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

    const wooData = {
      name: category.name,
      parent: category.parent_id,
      description: category.description,
      image: category.image
        ? {
            id: category.image.id,
            src: category.image.src,
          }
        : null,
    }

    try {
      if (category.woo_id) {
        await this.wooCommerceClient.put(
          `products/categories/${category.woo_id}`,
          wooData,
        )
      } else {
        const response = await this.wooCommerceClient.post(
          'products/categories',
          wooData,
        )
        await this.categoryRepository.updateWooId(categoryId, response.id)
      }
    } catch (error) {
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
