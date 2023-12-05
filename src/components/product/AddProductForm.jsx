import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { addProduct } from '../api/productService'

// Schéma de validation Yup
const ProductSchema = Yup.object().shape({
  reference: Yup.string().required('La référence est requise'),
  prixVente: Yup.number()
    .required('Le prix de vente est requis')
    .positive('Le prix de vente doit être un nombre positif'),
  // Ajoutez des champs supplémentaires selon la structure de votre produit
})

const AddProductForm = () => {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await addProduct(values)
      alert('Produit ajouté avec succès !')
      // Gérer le succès de la soumission ici (ex. nettoyer le formulaire, afficher un message, etc.)
    } catch (error) {
      alert("Erreur lors de l'ajout du produit.")
      // Gérer les erreurs ici
    }

    setSubmitting(false)
  }

  return (
    <Formik
      initialValues={{ reference: '', prixVente: '' }}
      validationSchema={ProductSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field name="reference" type="text" placeholder="Référence" />
          <Field name="prixVente" type="number" placeholder="Prix de Vente" />
          {/* Ajoutez d'autres champs de formulaire ici */}
          <button type="submit" disabled={isSubmitting}>
            Ajouter Produit
          </button>
        </Form>
      )}
    </Formik>
  )
}

export default AddProductForm
