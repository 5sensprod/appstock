import React from 'react'
import { useForm } from 'react-hook-form'
import { useProductContext } from '../../contexts/ProductContext'

function CreateCategory() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const { addCategory } = useProductContext()

  const onSubmit = async (data) => {
    // Définir parentId à null si vide
    const categoryData = {
      ...data,
      parentId: data.parentId || null,
    }

    try {
      await addCategory(categoryData)
      reset()
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Nom de la catégorie:</label>
        <input id="name" {...register('name', { required: true })} />
        {errors.name && <span>Ce champ est requis</span>}
      </div>
      <div>
        <label htmlFor="parentId">
          ID de la catégorie parente (laissez vide pour une catégorie
          principale):
        </label>
        <input id="parentId" {...register('parentId')} />
      </div>
      <button type="submit">Ajouter la catégorie</button>
    </form>
  )
}

export default CreateCategory
