


import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import styles from './ProductTable.module.css';
import { AlignHorizontalRight } from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://bookfinderback.onrender.com') 
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);



  const handleEdit = (id) => {
    navigate(`/editar-producto/${id}`);
  };



  const handleDelete = async (product) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar el producto?\n\nID: ${product.id}\nTítulo: ${product.titulo}\nAutor: ${product.autor}\nISBN: ${product.ISBN}`
    );
    if (confirmDelete) {
    try {
      const response = await fetch(`https://bookfinderback.onrender.com/producto-delete/${product.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      // Actualizar la lista de productos después de la eliminación
      setProducts(products.filter((p) => p.id !== product.id));

      console.log('Producto eliminado exitosamente con ID:', product.id);
      window.alert('El producto se eliminó exitosamente')
    } catch (error) {
      console.error('Error al eliminar el producto:', error.message);
    }}
  };

  const filteredBooks = products
    // (product) => product.titulo.toLowerCase().includes(searchQuery.toLowerCase())
    .filter((product) => product.titulo.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.id - b.id);
  


  return (

    <div className={styles.tableContainer}>
       <TextField
        label="Buscar por título"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        margin="normal"
      />
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.header}>ID</th>
            <th className={styles.header}>Título</th>
            <th className={styles.header}>Autor</th>
            <th className={styles.header}>Precio</th>
            <th className={styles.header}>Editorial</th>
            <th className={styles.header}>Disponibilidad</th>
            <th className={styles.header}>Publicación</th>
            <th className={styles.header}>ISBN</th>
            <th className={styles.header}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* {products.map((product) => ( */}

          {filteredBooks.map((product) => (
            <tr key={product.id}>
              <td className={styles.cell}>{product.id}</td>
              <td className={styles.cell}>{product.titulo}</td>
              <td className={styles.cell}>{product.autor}</td>
              <td className={`${styles.cell} ${styles.rightAlign}`}>{product.precio_$}</td>

              <td className={styles.cell}>{product.editorial}</td>
              <td className={styles.cell}>{product.stock ? 'En stock' : 'Sin stock'}</td>
              <td className={styles.cell}>{product.fecha_publicacion}</td>

              <td className={styles.cell}>{product.ISBN}</td>
              <td className={`${styles.cell} ${styles.actions}`}>
                <Button variant="outlined" size="small" onClick={() => handleEdit(product.id)}>
                  Editar
                </Button>
                <Button variant="outlined" size="small" onClick={() => handleDelete(product)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
