import React, { createContext, useContext, useState } from 'react'
import Toast from '../components/ui/Toast'
import ConfirmationDialog from '../components/ui/ConfirmationDialog'
import { Modal, Paper } from '@mui/material'

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

  // Gestion du titre de la page
  const [pageTitle, setPageTitle] = useState('Tableau de bord')

  const updatePageTitle = (title) => {
    setPageTitle(title)
  }

  // Gestion des modales
  const [modalInfo, setModalInfo] = useState({
    open: false,
    content: null,
  })

  const showModal = (content) => {
    setModalInfo({ open: true, content })
  }

  const closeModal = () => {
    setModalInfo({ open: false, content: null })
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
        showModal,
        closeModal,
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
      {/* Modale globale */}
      <Modal open={modalInfo.open} onClose={closeModal}>
        <Paper style={{ margin: 'auto', padding: 20, maxWidth: 600 }}>
          {modalInfo.content}
        </Paper>
      </Modal>
    </UIContext.Provider>
  )
}
