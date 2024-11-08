// Función para convertir el precio a un número para poder ordenarlo
function convertirPrecio(precio) {
    // Extraer el número del precio usando una expresión regular
    const match = precio.match(/(\d+[,.]?\d*)(?=\s*€)/); // Busca números con coma o punto antes del símbolo de euro
    if (match) {
        return parseFloat(match[0].replace(',', '.')); // Convertir a número flotante reemplazando la coma por un punto
    }
    return 0; // Retornar 0 si no se encuentra un precio válido
}

// Función para ordenar los productos por precio
function ordenarPorPrecio(productos) {
    return productos.sort((a, b) => {
        const precioA = convertirPrecio(a.precio_por_unidad);
        const precioB = convertirPrecio(b.precio_por_unidad);
        if (precioA === precioB) {
            return convertirPrecio(a.precio_unitario) - convertirPrecio(b.precio_unitario);
        }
        return precioA - precioB;
    });
}

export function compararProductos(nombreProducto, productosDia, productosMercadona) {
    // Unir los productos en un solo array
    const todosLosProductos = [
        ...productosDia.map(producto => ({
            supermercado: 'Dia',
            nombre: producto.nombre,
            precio_unitario: producto.precio_unitario,
            precio_por_unidad: producto.precio_por_unidad,
            imagen: producto.imagen
        })),
        ...productosMercadona.map(producto => ({
            supermercado: 'Mercadona',
            nombre: producto.nombre,
            precio_unitario: producto.precio_unitario.replace('.', ','),
            precio_por_unidad: producto.precio_por_unidad.replace('.', ','),
            imagen: producto.imagen
        }))
    ];

    const productosOrdenados = ordenarPorPrecio(todosLosProductos);

    return productosOrdenados;
}
