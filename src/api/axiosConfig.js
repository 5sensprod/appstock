import axios from 'axios'
import { getLocalIp } from '../ipcHelper'

export const isRunningInElectron = () => {
  return (
    typeof window !== 'undefined' && (window.electronAPI || window.electron)
  )
}

export const getApiBaseUrl = async () => {
  if (isRunningInElectron()) {
    const localIp = await getLocalIp()
    return `http://${localIp}:5000/api`
  } else {
    return '/api'
  }
}

const axiosInstance = axios.create()

export const fetchApi = async (endpoint, method = 'GET', data = null) => {
  const baseUrl = await getApiBaseUrl()
  const url = `${baseUrl}/${endpoint}`

  const config = {}

  // Si les données ne sont pas une instance de FormData, définissez le Content-Type sur application/json
  if (!(data instanceof FormData)) {
    config.headers = {
      'Content-Type': 'application/json',
    }
  }

  try {
    switch (method) {
      case 'POST':
        return (await axiosInstance.post(url, data, config)).data
      case 'PUT':
        return (await axiosInstance.put(url, data, config)).data
      case 'DELETE':
        return (await axiosInstance.delete(url, config)).data
      case 'GET':
      default:
        return (await axiosInstance.get(url, config)).data
    }
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API:", error)
    throw error
  }
}

export default axiosInstance
