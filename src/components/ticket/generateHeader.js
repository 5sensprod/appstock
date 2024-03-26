// Fonction pour générer l'en-tête du ticket
export function generateHeader(documentData, formattedDateTime, companyInfo) {
  return `
      <p class="company">${companyInfo.name.toUpperCase()}</p>
      <p class="content">${companyInfo.address}</p>
      <p class="content" style="font-size: 14px;">${companyInfo.city}</p>
      <p class="content">${companyInfo.phone}</p>
      <p class="content">${companyInfo.email}</p>
      <div style="border-top: 1px dashed black; margin-bottom: 5px; margin-top: 5px;"></div>
      <p class="header">TICKET</p>
      <p class="content">${documentData.number}</p>
      <p class="content">le ${formattedDateTime}</p> <!-- Utilisation de la date/heure formatée -->
      <div style="border-top: 1px dashed black; margin-bottom: 5px; margin-top: 5px;"></div>
    `
}
