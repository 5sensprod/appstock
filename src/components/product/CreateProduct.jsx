import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { TextField, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useProductContext } from '../../contexts/ProductContext'
import Toast from '../ui/Toast'

export const CreateProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()
  const { addProduct } = useProductContext()
  const navigate = useNavigate()
  const [toastOpen, setToastOpen] = useState(false)
  // Structure de données pour les champs de formulaire
  const productFields = [
    { name: 'reference', label: 'Référence', type: 'text' },
    { name: 'prixVente', label: 'Prix de Vente', type: 'number' },
    { name: 'description', label: 'Description', type: 'text' },
    // Ajoutez d'autres champs ici selon vos besoins
  ]

  const onSubmit = async (data) => {
    try {
      await addProduct(data)
      reset() // Réinitialiser le formulaire
      setToastOpen(true) // Afficher le Toast
      setTimeout(() => navigate('/catalog'), 3000)
    } catch (error) {
      console.error(error)
      // Gérer l'affichage d'un Toast d'erreur si nécessaire
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {productFields.map(({ name, label, type }) => (
          <TextField
            key={name}
            label={label}
            type={type}
            {...register(name, { required: 'Ce champ est requis' })}
            error={!!errors[name]}
            helperText={errors[name]?.message}
          />
        ))}
        <Button type="submit">Ajouter Produit</Button>
      </form>
      <Toast
        open={toastOpen}
        handleClose={() => setToastOpen(false)}
        message="Produit ajouté avec succès!"
        severity="success"
      />
    </>
  )
}

export default CreateProduct
