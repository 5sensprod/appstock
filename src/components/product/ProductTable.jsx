import React from 'react'
import { useProductContext } from '../../contexts/ProductContext'

const ProductTable = ({ products, onEdit }) => {
  const { baseUrl } = useProductContext()
  return (
    <table>
      <thead>
        <tr>
          <th>Photo</th>
          <th>Référence</th>
          <th>Marque</th>
          <th>Gencode</th>
          <th>Prix de vente</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product._id} style={{ cursor: 'pointer' }}>
            <td>
              {product.photos && product.photos.length > 0 && (
                <img
                  src={`${baseUrl}/${product.photos[0]}`}
                  alt={product.reference}
                  style={{ width: '100px', height: 'auto' }}
                />
              )}
            </td>
            <td>{product.reference}</td>
            <td>{product.marque}</td>
            <td>{product.gencode}</td>
            <td>{product.prixVente} €</td>
            <td>
              <button onClick={() => onEdit(product)}>Modifier</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ProductTable
