

import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import styles from './VerCategorias.module.css';

const VerCategorias = () => {
  const [categorias, setCategorias] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('https://bookfinderback.onrender.com/categorias-buscar-todas')
      .then((response) => response.json())
      .then((data) => setCategorias(data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  const handleEditCategoria = (id) => {
    // Lógica para editar la categoría con el ID proporcionado
    console.log('Editar categoría con ID:', id);
  };

  const handleDeleteCategoria = (id) => {

    
    // Lógica para eliminar la categoría con el ID proporcionado
    console.log('Eliminar categoría con ID:', id);
  };

  const filteredCategorias = categorias
  // (product) => product.titulo.toLowerCase().includes(searchQuery.toLowerCase())
  .filter((categoria) => categoria.nombre.toLowerCase().includes(searchQuery.toLowerCase()))
  .sort((a, b) => a.id - b.id);

  return (


    <div>
    <div className={styles.tableContainer}>
       <TextField
        label="Buscar Categoria por Nombre"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        margin="normal"
      />
      </div>


    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.header}>ID</th>
            <th className={styles.header}>Categoría</th>
            <th className={styles.header}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategorias.map((categoria) => (
            <tr key={categoria.id}>
              <td className={styles.cell}>{categoria.id}</td>
              <td className={styles.cell}>{categoria.nombre}</td>
              <td className={`${styles.cell} ${styles.actions}`}>
                <Button variant="outlined" size="small" onClick={() => handleEditCategoria(categoria.id)}>
                  Editar
                </Button>
                <Button variant="outlined" size="small" onClick={() => handleDeleteCategoria(categoria.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    </div>
  );
};

export default VerCategorias;
