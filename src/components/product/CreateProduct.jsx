import React from 'react'
import { useForm } from 'react-hook-form'
import { TextField, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useProductContext } from '../../contexts/ProductContext'
import { useUI } from '../../contexts/UIContext'

export const CreateProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const { addProduct } = useProductContext()
  const { showToast } = useUI()
  const navigate = useNavigate()
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
      showToast('Produit ajouté avec succès!', 'success')
      navigate('/catalog')
    } catch (error) {
      console.error(error)
      showToast("Erreur lors de l'ajout du produit", 'error')
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
    </>
  )
}

export default CreateProduct
