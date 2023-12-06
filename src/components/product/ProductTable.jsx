import React from 'react'

const ProductTable = ({ products, baseUrl }) => {
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
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ProductTable
