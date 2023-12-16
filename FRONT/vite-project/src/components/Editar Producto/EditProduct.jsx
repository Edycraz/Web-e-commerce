
import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EditProduct.module.css'
import MenuItem from '@mui/material/MenuItem';
import { FormControlLabel, Checkbox } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');

  const [nuevaUrlDeCloudinary, setNuevaUrlDeCloudinary] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://bookfinderback.onrender.com/producto-y-categoria-por-ID/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener detalles del producto.');
        }
        const data = await response.json();
        setProduct({
          ...data,
          // categoria: data.categoria && data.categoria.length > 0 ? [data.categoria[0]] : [],
          categoria: data.Categoria && data.Categoria.length > 0 ? [data.Categoria[0].id] : [],
        });
      } catch (error) {
        console.error('Error fetching product details:', error.message);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'nuevaCategoria') {
      setProduct({ ...product, categoria: [{ id: value }] });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleCategoriaChange = (event) => {
    const value = event.target.value;
  
    setProduct({ ...product, categoria: [value] });
    setSelectedCategoria(value);
  };
  

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('https://bookfinderback.onrender.com/categorias-buscar-todas');
        if (!response.ok) {
          throw new Error('Error al obtener categorías.');
        }
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error('Error al obtener categorías:', error.message);
      }
    };

    fetchCategorias();
  }, []);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://bookfinderback.onrender.com/editar-producto/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          categoria: product.categoria  // Enviamos un array de IDs
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      console.log('Producto actualizado exitosamente con ID:', id);
      window.alert('El producto se actualizó exitosamente');
      navigate('/administrador/mis-productos');
    } catch (error) {
      console.error('Error al actualizar el producto:', error.message);
    }
  };
  
  
  const handleStockChange = (event) => {
    const { value } = event.target;
    setProduct({ ...product, stock: value === 'true' });
  };


  
  

  const handleNuevaImagenChange = async (e) => {
    const file = e.target.files[0];
    try{
    const data = new FormData();

    data.append('file', file);
    data.append('upload_preset', 'preset_libros');

      const response = await fetch('https://api.cloudinary.com/v1_1/dnefbrqfz/image/upload', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const responseData = await response.json();
      setProduct({
        ...product,
        url_imagen: responseData.secure_url,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleEliminarImagen = () => {
    setProduct({
      ...product,
      url_imagen: nuevaUrlDeCloudinary || null,
    });
    setNuevaUrlDeCloudinary(''); 
  };

  const imageUrlDisabled = !!nuevaUrlDeCloudinary;

  return (

    <div>
      {console.log(product)}

      

      <h2>Editar Producto</h2>
      <TextField
        label="Título"
        name="titulo"
        value={product.titulo || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Autor"
        name="autor"
        value={product.autor || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Precio"
        name="precio_$"
        type="number"
        value={product.precio_$ || 0}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

<TextField
        label="Cantidad de páginas"
        name="nro_paginas"
        type='number'
        value={product.nro_paginas || 0}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

<TextField
        label="Peso / gramos:"
        name="peso"
        type='number'
        value={product.peso || 0}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

<TextField
        label="Fecha de publicación:"
        name="fecha_publicacion"
        type='date'
        value={product.fecha_publicacion || ''}
        onChange={handleChange}
        pattern="\d{4}-\d{2}-\d{2}"
        fullWidth
        margin="normal"
        required
      />
<div>
<TextField
        label="ISBN:"
        name="ISBN"
        value={product.ISBN || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
       
      />
      {product.ISBN && product.ISBN.length !== 13 && (
  <span className={styles.error}>El ISBN debe tener 13 dígitos</span>
)}

        {/* {isbnExists && (
          <span className={styles.error}>El ISBN ya existe en la base de datos</span>
        )} */}

</div>

<TextField
        label="Editorial:"
        name="editorial"
        value={product.editorial || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

<TextField
  label="Idioma actual"
  name="idiomaActual"
  value={product.idioma || ''}
  fullWidth
  margin="normal"
  InputProps={{
    readOnly: true,
  }}
/>

<TextField
  label="Nuevo Idioma"
  name="idioma"
  select
  value={product.idioma || ''}
  onChange={handleChange}
  fullWidth
  margin="none"
  required
>
  <MenuItem value={product.idioma}>{product.idioma}</MenuItem>
  <MenuItem value="Castellano">Castellano</MenuItem>
  <MenuItem value="Inglés">Inglés</MenuItem>
  <MenuItem value="Alemán">Alemán</MenuItem>
  <MenuItem value="Latín">Latín</MenuItem>
  <MenuItem value="Francés">Francés</MenuItem>
  <MenuItem value="Hebreo">Hebreo</MenuItem>
  <MenuItem value="Otro">Otro</MenuItem>
</TextField> 



<TextField
  label="Categoria Actual"
  name="categoriaActual"
// const categoriaValue = {product.categoria || ''}
  value={product.Categoria && product.Categoria.length > 0 ? product.Categoria[0].nombre : ''}
  fullWidth
  margin="normal"
  InputProps={{
    readOnly: true,
  }}
/>



<TextField
  label="Nueva Categoria"
  name="nuevaCategoria"
  select
  // value={product.categoria && product.categoria.length > 0 ? product.categoria[0].id : ''}
  value={selectedCategoria}

  onChange={handleCategoriaChange}
  fullWidth
  margin="normal"
  required
>
 

  {categorias.map((categoria) => (
   <MenuItem key={categoria.id} /*value={Number(categoria.id)}*/ value={categoria.id}>
   {categoria.nombre}
 </MenuItem>
  ))}
</TextField>




<div className={styles.inputContainer}>
<label htmlFor="descripcion">Descripción</label>
<TextField
  
  id="descripcion"
  name="descripcion"
  multiline
  rows={4}
  value={product.descripcion}
  onChange={handleChange}
  fullWidth
  margin="normal"
  className={styles.input}
/>
</div>

<div className={styles.formGroup}>
        <label>Stock:</label>
        <div>
          <input
            type="radio"
            id="stockTrue"
            name="stock"
            value="true"
            checked={product.stock === true}
            onChange={handleStockChange}
            className={styles.checkbox}
          />
          <label htmlFor="stockTrue">Disponible</label>
        </div>
        <div>
          <input
            type="radio"
            id="stockFalse"
            name="stock"
            value="false"
            checked={product.stock === false}
            onChange={handleStockChange}
            className={styles.checkbox}
          />
          <label htmlFor="stockFalse">No Disponible</label>
        </div>
      </div>





{/* <div className={styles.formGroup}>
          <label htmlFor="stock">Stock:</label>
          <input
            type="checkbox"
            id="stock"
            name="stock"
            checked={product.stock}
            onChange={handleChange}
            className={styles.checkbox}
          />
        </div> */}

  
        <div className={styles.inputContainer}>
      <label htmlFor="url_imagen">URL de Imagen</label>
<TextField
        // label="URL de Imagen"
        id="url_imagen"
        name="url_imagen"
        type="text"
        value={nuevaUrlDeCloudinary || product.url_imagen}
        onChange={handleChange}
        fullWidth
        margin="normal"
        className={styles.input}
        required
        disabled={imageUrlDisabled}
      />
      </div>
 
<div className={styles.imageContainer}>
        <img src={product.url_imagen || nuevaUrlDeCloudinary} alt="Imagen actual" />
       
        </div>



<div className={styles.buttonGroup}>
  {product.url_imagen && (
    <Button
      variant="outlined"
      color="secondary"
      startIcon={<CloudUploadIcon />}
      onClick={handleEliminarImagen}
      className={styles.deleteButton}
    >
      Eliminar Imagen Actual
    </Button>
  )}

  <label htmlFor="nueva_imagen">
    <input
      accept="image/*"
      id="nueva_imagen"
      name="nueva_imagen"
      type="file"
      onChange={handleNuevaImagenChange}
      style={{ display: 'none' }}
    />
    <Button
      variant="contained"
      component="span"
      startIcon={<CloudUploadIcon />}
      className={styles.customButton}
    >
      Elegir Archivo
    </Button>
  </label>
</div>

      <div className={styles.updateButtonContainer}>
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Actualizar Producto
        </Button>
      </div>
  
</div>

  );

};


export default EditProduct;