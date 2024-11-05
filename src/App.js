import axios from 'axios';
import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [listaCompra, setListaCompra] = useState({ mercadona: [], dia: [] });
  const [isListaVisible, setIsListaVisible] = useState(false);
  const server = 'http://localhost:5000';

  const fetchCompareProducts = () => {
    if (!searchTerm) return;
    axios.get(`${server}/compare/${searchTerm}`)
      .then(response => {
        mostrarResultados(response.data);
      })
      .catch(error => console.error('Error fetching compare products:', error));
  };

  const mostrarResultados = (productos) => {
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = "<h2>Resultados ordenados por precio:</h2>";
    const listaProductos = document.createElement("div");
    productos.forEach(producto => {
      const productoDiv = document.createElement("div");
      productoDiv.className = "product-card";
      productoDiv.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3><strong>${producto.nombre}</strong></h3>
        <p><strong>Precio:</strong> ${producto.precio_unitario} €</p>
        <p><strong>Precio por unidad:</strong> ${producto.precio_por_unidad} €</p>
        <button class="add-to-cart-btn">Añadir a la lista de la compra</button>
      `;
      resultadosDiv.appendChild(listaProductos);
      listaProductos.appendChild(productoDiv);

      const btn = productoDiv.querySelector(".add-to-cart-btn");
      btn.addEventListener("click", () => agregarAListaCompra(producto));
    });
  };

  const agregarAListaCompra = (producto) => {
    const supermercado = producto.supermercado.toLowerCase();
    if (supermercado === "mercadona" || supermercado === "dia") {
      setListaCompra(prev => ({
        ...prev,
        [supermercado]: [...prev[supermercado], producto]
      }));
      alert(`${producto.nombre} ha sido añadido a la lista de la compra en ${supermercado}.`);
    } else {
      alert("Supermercado no reconocido.");
    }
  };

  const mostrarListaCompra = () => {
    setIsListaVisible(true);
  };

  const cerrarListaCompra = () => {
    setIsListaVisible(false);
  };

  const guardarListaComoImagen = () => {
    const listaCompraDiv = document.getElementById("listaCompraDiv");

    if (listaCompraDiv.innerHTML.trim() === "") {
      alert("No hay contenido en la lista de la compra para guardar.");
      return;
    }

    html2canvas(listaCompraDiv, { scale: 3 }).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL("image/png");
      link.download = 'lista_de_la_compra.png';
      link.click();
    }).catch(error => {
      console.error("Error al capturar la lista de la compra:", error);
    });
  };

  const calcularTotales = () => {
    let totalMercadona = 0;
    let totalDia = 0;

    listaCompra.mercadona.forEach(producto => {
      totalMercadona += parseFloat(producto.precio_unitario.replace(',', '.').replace(' €', ''));
    });

    listaCompra.dia.forEach(producto => {
      totalDia += parseFloat(producto.precio_unitario.replace(',', '.').replace(' €', ''));
    });

    return { totalMercadona, totalDia, totalGeneral: totalMercadona + totalDia };
  };

  const { totalMercadona, totalDia, totalGeneral } = calcularTotales();

  return (
    <div className="app-container">
      <h1>Lista de Productos</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar productos"
      />
      <button onClick={fetchCompareProducts}>Buscar</button>
      <button onClick={() => { mostrarListaCompra(); }}>Ver lista de la compra</button>
      
      <div id="resultados"></div>

      {/* Sección de la lista de compra */}
      {isListaVisible && (
        <div className="lista-modal">
          <h2>Lista de la compra:</h2>
          <div id="listaCompraDiv">
            {/* Mostrar lista Mercadona */}
            {listaCompra.mercadona.length > 0 ? (
              <>
                <h3>Lista de la compra Mercadona:</h3>
                {listaCompra.mercadona.map((producto, index) => (
                  <p key={index}><strong>{producto.nombre}</strong> - {producto.precio_unitario} 
                  <img src={producto.imagen} alt={producto.nombre} style={{ width: '50px', height: 'auto' }} /></p>
                ))}
                <p><strong>Total Mercadona:</strong> {totalMercadona.toFixed(2)} €</p>
              </>
            ) : (
              <p>No hay productos en la lista de la compra en Mercadona.</p>
            )}

            {/* Mostrar lista Dia */}
            {listaCompra.dia.length > 0 ? (
              <>
                <h3>Lista de la compra Dia:</h3>
                {listaCompra.dia.map((producto, index) => (
                  <p key={index}><strong>{producto.nombre}</strong> - {producto.precio_unitario} 
                  <img src={producto.imagen} alt={producto.nombre} style={{ width: '50px', height: 'auto' }} /></p>
                ))}
                <p><strong>Total Dia:</strong> {totalDia.toFixed(2)} €</p>
              </>
            ) : (
              <p>No hay productos en la lista de la compra en Dia.</p>
            )}
            
            {/* Mostrar total general */}
            <h3>Total general de la compra: {totalGeneral.toFixed(2)} €</h3>
          </div>
          <button id="guardarListaBtn" onClick={guardarListaComoImagen}>Guardar lista de la compra como imagen</button>
          <button onClick={cerrarListaCompra}>Cerrar</button>
        </div>
      )}
    </div>
  );
}

export default App;
