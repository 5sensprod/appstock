// Fonction pour générer une ligne de séparation avec des marges personnalisées
export const generateLine = (marginTop = '5px', marginBottom = '5px') => {
  return `<div style="border-top: 1px dashed black; margin-top: ${marginTop}; margin-bottom: ${marginBottom};"></div>`
}
