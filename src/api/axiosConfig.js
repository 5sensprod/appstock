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

  console.log(`Envoi d'une requête ${method} à ${url}`, data)

  switch (method) {
    case 'POST':
      return (await axiosInstance.post(url, data)).data
    case 'PUT':
      return (await axiosInstance.put(url, data)).data
    case 'DELETE':
      return (await axiosInstance.delete(url)).data
    case 'GET':
    default:
      return (await axiosInstance.get(url)).data
  }
}

export default axiosInstance
