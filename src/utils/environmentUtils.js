// src/utils/environmentUtils.js (nouveau fichier pour regrouper les utilitaires)
export const isRunningInElectron = () => {
  return typeof window !== 'undefined' && window.electron !== undefined
}
