import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, TextField } from '@mui/material'
import { useProductContext } from '../../contexts/ProductContext'
import { capitalizeFirstLetter } from '../../utils/formatUtils'
import CustomSelect from '../ui/CustomSelect'
import { TVA_RATES } from '../../utils/constants'

const CreateProductShort = ({
  initialGencode,
  initialReference,
  onProductAdd,
  onCancel,
}) => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      reference: capitalizeFirstLetter(initialReference) || '',
      prixVente: '',
      prixAchat: '',
      tva: 20,
      gencode: initialGencode || '',
    },
  })

  const { addProduct } = useProductContext()

  const onSubmit = async (values) => {
    try {
      await addProduct(values)
      reset()
      if (onProductAdd) {
        onProductAdd()
      }
    } catch (error) {}
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="reference"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="text"
            placeholder="Référence"
            variant="outlined"
            fullWidth
            margin="normal"
            label="Référence"
          />
        )}
      />
      <Controller
        name="prixVente"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="number"
            placeholder="Prix de Vente"
            variant="outlined"
            fullWidth
            margin="normal"
            label="Prix de vente"
          />
        )}
      />
      <Controller
        name="prixAchat"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="number"
            placeholder="Prix d'Achat"
            variant="outlined"
            fullWidth
            margin="normal"
            label="Prix d'Achat"
          />
        )}
      />
      <Controller
        name="tva"
        control={control}
        render={({ field }) => (
          <CustomSelect {...field} label="TVA" options={TVA_RATES} />
        )}
      />
      <Controller
        name="gencode"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="text"
            placeholder="Gencode"
            variant="outlined"
            fullWidth
            margin="normal"
            label="Gencode"
          />
        )}
      />

      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{ mt: 2 }}
        >
          Ajouter Produit
        </Button>

        <Button variant="contained" onClick={onCancel} sx={{ mt: 2 }}>
          Annuler
        </Button>
      </div>
    </form>
  )
}

export default CreateProductShort
