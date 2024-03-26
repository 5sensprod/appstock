// Fonction pour générer l'en-tête du ticket
export function generateHeader(documentData, formattedDateTime, companyInfo) {
  return `
      <p class="company">${companyInfo.name.toUpperCase()}</p>
      <p class="content">${companyInfo.address}</p>
      <p class="content" style="font-size: 14px;">${companyInfo.city}</p>
      <p class="content">${companyInfo.phone}</p>
      <p class="content">${companyInfo.email}</p>
      <p class="line" style="margin-bottom: 5px;">.............................................................</p>
      <p class="header">TICKET</p>
      <p class="content">${documentData.number}</p>
      <p class="content">le ${formattedDateTime}</p> <!-- Utilisation de la date/heure formatée -->
      <p class="line" style="margin-bottom: 0;">.............................................................</p>
    `
}
