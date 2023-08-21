import React, { useState } from 'react';
import api from './api/settings';
import { useAuthService } from './api/AuthService'; // Adjust the path based on your project structure

function ProductManager() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState(null);

  const authService = useAuthService();
  const user = authService.getCurrentUser();

  const handleAddProduct = async () => {
    try {
      if (authService.isAuthenticated()) {
        const response = await api.post('/product', { name, price }, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        alert('Product added successfully!');
        setName('');
        setPrice('');
        console.log(response.data);
      } else {
        alert('Please log in to add a product.');
      }
    } catch (error) {
      alert('Error adding product.');
    }
  };

  const handleFindProduct = async () => {
    try {
      const response = await api.get(`/product/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setProduct(response.data);
    } catch (error) {
      alert('Product not found.');
    }
  };

  const handleRemoveProduct = async () => {
    try {
      await api.delete(`/product/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Product removed successfully!');
      setProduct(null);
    } catch (error) {
      alert('Error removing product.');
    }
  };

  const hitAPI = async () => {
    await api.post('/product', { name: 'teste', price: 'testeee' }, {
      headers: { Authorization: `Bearer XYZ` }
    });
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md flex flex-col space-y-4">
      <h2 className="text-xl font-semibold mb-4">Product Manager</h2>
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="p-2 border rounded"
      />
      <button onClick={handleAddProduct} className="bg-blue-500 text-white p-2 rounded">
        Add Product
      </button>
      <input
        type="text"
        placeholder="Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        className="p-2 border rounded"
      />
      <button onClick={handleFindProduct} className="bg-green-500 text-white p-2 rounded">
        Find Product
      </button>
      {product && (
        <div className="p-2 bg-gray-100 rounded">
          <p>Name: {product.name}</p>
          <p>Price: {product.price}</p>
          <button onClick={handleRemoveProduct} className="bg-red-500 text-white p-2 rounded mt-2">
            Remove Product
          </button>
        </div>
      )}
      <button onClick={hitAPI} className="bg-blue-500 text-white p-2 rounded">
        Hit API
      </button>
    </div>
  );
}

export default ProductManager;
