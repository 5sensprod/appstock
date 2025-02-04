// hooks/useModals.js
import { useState } from 'react'

export const useModals = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isGenerateCodesModalOpen, setIsGenerateCodesModalOpen] =
    useState(false)

  return {
    isExportModalOpen,
    isGenerateCodesModalOpen,
    handleExportModalOpen: () => setIsExportModalOpen(true),
    handleExportModalClose: () => setIsExportModalOpen(false),
    handleGenerateCodesModalOpen: () => setIsGenerateCodesModalOpen(true),
    handleGenerateCodesModalClose: () => setIsGenerateCodesModalOpen(false),
  }
}
