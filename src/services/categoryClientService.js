// src/services/categoryClientService.js
import { fetchApi } from '../api/axiosConfig'

class CategoryClientService {
  async listCategories() {
    return await fetchApi('v2/categories')
  }

  async createCategory(categoryData) {
    return await fetchApi('v2/categories', 'POST', categoryData)
  }

  async updateCategory(id, categoryData) {
    return await fetchApi(`v2/categories/${id}`, 'PUT', categoryData)
  }

  async deleteCategory(id) {
    return await fetchApi(`v2/categories/${id}`, 'DELETE')
  }

  async syncFromWoo() {
    return await fetchApi('v2/sync/from-woo', 'POST')
  }

  async syncToWoo(id) {
    return await fetchApi(`v2/sync/to-woo/${id}`, 'POST')
  }

  async createAndSync(categoryData) {
    return await fetchApi('v2/categories?sync=true', 'POST', categoryData)
  }
}

export default new CategoryClientService()
