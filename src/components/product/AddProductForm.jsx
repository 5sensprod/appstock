import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { addProduct } from '../../api/productService'

// Schéma de validation Yup
const ProductSchema = Yup.object().shape({
  // Ajoutez des champs supplémentaires selon la structure de votre produit
})

const AddProductForm = ({ initialGencode, onProductAdd }) => {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await addProduct(values)
      resetForm()
      // Appeler onProductAdd pour signaler que le produit a été ajouté
      if (onProductAdd) {
        onProductAdd()
      }
    } catch (error) {
      // Gérer les erreurs ici
    }
    setSubmitting(false)
  }

  return (
    <Formik
      initialValues={{
        reference: '',
        prixVente: '',
        gencode: initialGencode || '',
        description: null,
        descriptionCourte: null,
        photos: [],
        videos: [],
        marque: null,
        SKU: null,
        categorie: null,
        sousCategorie: null,
        prixAchat: null,
        variable: true,
        stock: null,
        ficheTechnique: null,
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field name="reference" type="text" placeholder="Référence" />
          <Field name="prixVente" type="number" placeholder="Prix de Vente" />
          <Field name="gencode" type="text" placeholder="Gencode" />

          {/* Champs cachés */}
          <input type="hidden" name="description" />
          <input type="hidden" name="descriptionCourte" />
          <input type="hidden" name="photos" />
          <input type="hidden" name="videos" />
          <input type="hidden" name="marque" />
          <input type="hidden" name="SKU" />
          <input type="hidden" name="categorie" />
          <input type="hidden" name="sousCategorie" />
          <input type="hidden" name="prixAchat" />
          <input type="hidden" name="variable" />
          <input type="hidden" name="stock" />
          <input type="hidden" name="ficheTechnique" />

          <button type="submit" disabled={isSubmitting}>
            Ajouter Produit
          </button>
        </Form>
      )}
    </Formik>
  )
}

export default AddProductForm
