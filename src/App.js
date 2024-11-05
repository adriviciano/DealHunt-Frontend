import axios from 'axios';
import React, { useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const server = 'http://localhost:5000';

  const fetchMercadonaProducts = () => {
    if (!searchTerm) return;
    axios.get(`${server}/mercadona/${searchTerm}`)
      .then(response => {
        setProducts(response.data);
        console.log(response.data);
      })
      .catch(error => console.error('Error fetching Mercadona products:', error));
  };
  
  const fetchDiaProducts = () => {
    if (!searchTerm) return;
    axios.get(`${server}/dia/${searchTerm}`)
      .then(response => {
        setProducts(response.data);
        console.log(response.data);
      })
      .catch(error => console.error('Error fetching Dia products:', error));
   };
  

  return (
    <div>
      <h1>Lista de Productos</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar productos"
      />
      <button onClick={fetchMercadonaProducts}>Buscar en Mercadona</button>
      <button onClick={fetchDiaProducts}>Buscar en Dia</button>
      
      {products.length > 0 ? (
        <ul>
          {products.map((product, index) => (
            <li key={`${product.nombre}-${index}`}>
              {product.nombre} - {product.precio_unitario}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay productos disponibles</p>
      )}
    </div>
  );
}

export default App;
