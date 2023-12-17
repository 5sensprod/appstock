import React, { createContext, useContext, useState } from 'react'
import Toast from '../components/ui/Toast'
import ConfirmationDialog from '../components/ui/ConfirmationDialog'

const UIContext = createContext()

export const useUI = () => useContext(UIContext)

export const UIProvider = ({ children }) => {
  const [toastInfo, setToastInfo] = useState({
    open: false,
    message: '',
    severity: 'info',
  })

  const showToast = (message, severity = 'info') => {
    setToastInfo({ open: true, message, severity })
  }

  const closeToast = () => {
    setToastInfo({ ...toastInfo, open: false })
  }

  const [confirmDialogInfo, setConfirmDialogInfo] = useState({
    open: false,
    title: '',
    content: '',
    onConfirm: () => {},
  })

  const showConfirmDialog = (title, content, onConfirm) => {
    setConfirmDialogInfo({ open: true, title, content, onConfirm })
  }

  const closeConfirmDialog = () => {
    setConfirmDialogInfo({ ...confirmDialogInfo, open: false })
  }

  const [pageTitle, setPageTitle] = useState('Tableau de bord') // Nouvel état pour le titre de la page

  const updatePageTitle = (title) => {
    setPageTitle(title)
  }

  return (
    <UIContext.Provider
      value={{
        showToast,
        closeToast,
        showConfirmDialog,
        closeConfirmDialog,
        pageTitle,
        updatePageTitle,
      }}
    >
      {children}
      <Toast
        open={toastInfo.open}
        handleClose={closeToast}
        message={toastInfo.message}
        severity={toastInfo.severity}
      />
      <ConfirmationDialog
        open={confirmDialogInfo.open}
        onClose={closeConfirmDialog}
        onConfirm={() => {
          confirmDialogInfo.onConfirm()
          closeConfirmDialog()
        }}
        title={confirmDialogInfo.title}
        content={confirmDialogInfo.content}
      />
    </UIContext.Provider>
  )
}
