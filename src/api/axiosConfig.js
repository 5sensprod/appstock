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

  const config = {
    headers: {},
  }

  if (data) {
    config.headers['Content-Type'] = 'application/json'
    data = JSON.stringify(data)
  }

  try {
    const response = await axiosInstance({
      method: method,
      url: url,
      data: data,
      ...config,
    })
    return response.data
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API:", error)
    throw error
  }
}

export default axiosInstance
