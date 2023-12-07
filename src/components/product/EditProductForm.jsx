import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import SelectCategory from '../category/SelectCategory'

const EditProductForm = ({ product, categories, onProductUpdate }) => {
  const [selectedCategory, setSelectedCategory] = useState(
    product.categorie || '',
  )
  const initialValues = {
    reference: product.reference || '',
    prixVente: product.prixVente || 0,
    categorie: product.categorie || '',
    sousCategorie: product.sousCategorie || '',
    description: product.description || '',
    descriptionCourte: product.descriptionCourte || '',
    marque: product.marque || '',
    gencode: product.gencode || '',
    // Ajoutez d'autres champs au besoin
  }

  const validationSchema = Yup.object().shape({
    reference: Yup.string().required('Requis'),
    prixVente: Yup.number().required('Requis').positive('Doit être positif'),
    description: Yup.string().required('Requis'),
    descriptionCourte: Yup.string(),
    marque: Yup.string(),
    gencode: Yup.string(),
    // Ajoutez des validations pour d'autres champs si nécessaire
  })

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        onProductUpdate(product._id, values)
        setSubmitting(false)
      }}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form>
          <div>
            <label htmlFor="reference">Référence</label>
            <Field name="reference" type="text" />
          </div>
          <div>
            <label htmlFor="prixVente">Prix de vente</label>
            <Field name="prixVente" type="number" />
          </div>
          <div>
            <label htmlFor="categorie">Catégorie</label>
            <SelectCategory
              categories={categories}
              selectedCategoryId={values.categorie}
              onCategoryChange={(e) => {
                setFieldValue('categorie', e.target.value)
                // ... autres actions lors du changement de catégorie
              }}
              parentFilter={null}
            />
          </div>
          <div>
            <label htmlFor="sousCategorie">Sous-catégorie</label>
            <SelectCategory
              categories={categories}
              selectedCategoryId={values.sousCategorie}
              onCategoryChange={(e) =>
                setFieldValue('sousCategorie', e.target.value)
              }
              parentFilter={values.categorie}
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <Field name="description" as="textarea" />
          </div>
          <div>
            <label htmlFor="descriptionCourte">Description Courte</label>
            <Field name="descriptionCourte" as="textarea" />
          </div>
          <div>
            <label htmlFor="marque">Marque</label>
            <Field name="marque" type="text" />
          </div>
          <div>
            <label htmlFor="gencode">Gencode</label>
            <Field name="gencode" type="text" />
          </div>
          {/* Ajoutez des champs pour d'autres propriétés si nécessaire */}
          <button type="submit" disabled={isSubmitting}>
            Mettre à jour
          </button>
        </Form>
      )}
    </Formik>
  )
}

export default EditProductForm
