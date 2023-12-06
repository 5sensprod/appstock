import React from 'react'
import { ProductProvider } from './contexts/ProductContext'
import MyComponent from './MyComponent'
import ProductManager from './components/product/ProductManager'

const App = () => {
  return (
    <ProductProvider>
      <div>
        <h2>Hello from React é!</h2>
        <MyComponent />
        <ProductManager />
      </div>
    </ProductProvider>
  )
}

export default App
