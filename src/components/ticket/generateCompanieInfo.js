export function generateCompanieInfo(companyInfo) {
  return `
        <p class="company">${companyInfo.name.toUpperCase()}</p>
        <p class="content">${companyInfo.address}</p>
        <p class="content">${companyInfo.city}</p>
        <p class="content">${companyInfo.phone}</p>
        <p class="content">${companyInfo.email}</p>
      `
}
