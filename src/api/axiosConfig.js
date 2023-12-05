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

export const fetchApi = async (endpoint, method = 'GET', data = null) => {
  const baseUrl = await getApiBaseUrl()
  const url = `${baseUrl}/${endpoint}`

  console.log(`Envoi d'une requête ${method} à ${url}`, data) // Log de la requête

  if (method === 'POST') {
    return (await axiosInstance.post(url, data)).data
  } else {
    return (await axiosInstance.get(url)).data
  }
}
export default axiosInstance
