import axios from 'axios'
import { getLocalIp } from '../ipcHelper' // Assurez-vous que le chemin est correct

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
    return '/api' // Ou l'URL de votre serveur backend si différent
  }
}

const axiosInstance = axios.create()

export const fetchApi = async (endpoint) => {
  const baseUrl = await getApiBaseUrl()
  const response = await axiosInstance.get(`${baseUrl}/${endpoint}`)
  return response.data
}

export default axiosInstance
