import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import SelectCategory from '../category/SelectCategory'

const EditProductForm = ({
  product,
  categories,
  onProductUpdate,
  onCancel,
}) => {
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
    prixVente: Yup.number()
      .positive('Le prix de vente doit être un nombre positif')
      .min(0.01, 'Le prix de vente doit être supérieur à zéro')
      .nullable(true), // Permet les valeurs nulles

    prixAchat: Yup.number()
      .positive("Le prix d'achat doit être un nombre positif")
      .min(0.01, "Le prix d'achat doit être supérieur à zéro")
      .nullable(true),

    stock: Yup.number()
      .positive('Le stock doit être un nombre positif')
      .min(1, 'Le stock doit être au moins de 1')
      .nullable(true),

    gencode: Yup.string()
      .matches(/^\d+$/, 'Le gencode doit contenir uniquement des chiffres')
      .nullable(true),
  })

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        const updatedProduct = {
          ...product,
          ...values,
        }
        onProductUpdate(product._id, updatedProduct)
        setSubmitting(false)
      }}
    >
      {({ errors, touched, isSubmitting, setFieldValue, values }) => (
        <Form>
          <div>
            <label htmlFor="reference">Référence</label>
            <Field name="reference" type="text" />
          </div>
          <div>
            <label htmlFor="prixVente">Prix de vente</label>
            <Field name="prixVente" type="number" />
            {touched.prixVente && errors.prixVente && (
              <div>{errors.prixVente}</div>
            )}
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
            {touched.gencode && errors.gencode && <div>{errors.gencode}</div>}
          </div>
          {/* Ajoutez des champs pour d'autres propriétés si nécessaire */}
          <button type="submit" disabled={isSubmitting}>
            Mettre à jour
          </button>
          <button type="button" onClick={onCancel}>
            Annuler
          </button>
        </Form>
      )}
    </Formik>
  )
}

export default EditProductForm
