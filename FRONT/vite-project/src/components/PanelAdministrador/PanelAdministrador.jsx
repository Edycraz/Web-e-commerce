import React, { useState, useEffect } from 'react';
import styles from './PanelAdministrador.module.css';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, RadioGroup, FormControlLabel, FormLabel, Radio, Snackbar, IconButton, TextareaAutosize } from '@mui/material';







const PanelAdministrador = () => {
  const [producto, setProducto] = useState({
    titulo: '',
    autor: '',
    precio_$: 0,
    nro_paginas: 0,
    peso: 0,
    fecha_publicacion: '', 
    ISBN: '',
    editorial: '',
    idioma: '',
    descripcion: '',
    stock: false,
    url_imagen: '',
    categoria: []
  });


  const [categorias, setCategorias] = useState([]);
  const [isbnExists, setIsbnExists] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [urlImagen, setUrlImagen] = useState('');

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

    // Llama a la función para obtener las categorías cuando se monta el componente
    fetchCategorias();
  }, []); 


  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
      setProducto({ ...producto, [name]: checked });
    } else {
      setProducto({ ...producto, [name]: value });
    }
    // setProducto({ ...producto, [name]: value });
    if (name === 'ISBN') {
      checkIsbnExists(value);
      console.log(value)
    }
    console.log(producto)
  };



  const handleCategoriaChange = (event) => {
    const value = event.target.value;
    const updatedCategorias = [...producto.categoria];
  
    // Si la categoría ya está seleccionada, quítala; de lo contrario, agrégala
    if (updatedCategorias.includes(value)) {
      const index = updatedCategorias.indexOf(value);
      updatedCategorias.splice(index, 1);
    } else {
      updatedCategorias.push(value);
    }
  
    setProducto({ ...producto, categoria: updatedCategorias });
  };


  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (producto.ISBN.length === 13) {
      checkIsbnExists(producto.ISBN);
      if (!isbnExists) {
        await postData();
        // Restablecer el estado del formulario
        setProducto({
          titulo: '',
          autor: '',
          precio_$: 0,
          nro_paginas: 0,
          peso: 0,
          fecha_publicacion: '', 
          ISBN: '',
          editorial: '',
          idioma: '',
          descripcion: '',
          stock: false,
          url_imagen: '',
          categoria: []
        });
        // Mostrar un mensaje de éxito al usuario
        deleteImage();
        setGuardadoExitoso(true);
      } else {
        window.alert('ISBN ya existe en la base de datos');
      }
    } else {
      window.alert('El ISBN debe tener 13 dígitos');
    }
  
    console.log('Datos del libro', producto);
  };
 
  const checkIsbnExists = async (isbn) => {
    const isbnString = String(isbn);

    const url = `https://bookfinderback.onrender.com/producto/check?isbn=${isbnString}`; // Reemplaza con tu endpoint real
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      setIsbnExists(data.exists);
    } catch (error) {
      console.error('Error al verificar el ISBN:', error.message);
    }
  };

    const postData = async () => {
        const url = 'https://bookfinderback.onrender.com';       
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
              
              ...producto,
              precio_$: parseInt(producto.precio_$, 10), 
          peso: parseInt(producto.peso, 10), 
          categorias: producto.categoria.map(Number),
              // stock: producto.stock === "on" ? true : false,
              // [name]: value === 'true', 
             
             
          }),
          });
      
          if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }
      
          const data = await response.json();
          console.log('Respuesta del servidor:', data);
          // Puedes manejar la respuesta del servidor según tus necesidades
      
        } catch (error) {
          console.error('Error al enviar la solicitud:', error.message);
          // Puedes manejar los errores aquí
        }
    };
    // Aquí puedes enviar el producto al backend o realizar otras acciones necesarias
    
    // Enviar el producto al backend, etc.
    const precioValue = producto.precio_$;


    const changeUploadImage = async (e) => {
      const file = e.target.files[0];
      const data = new FormData();
  
      data.append('file', file);
      data.append('upload_preset', 'preset_libros');
  
      try {
        const response = await axios.post('https://api.cloudinary.com/v1_1/dnefbrqfz/image/upload', data);
        console.log(response.data);
        setProducto({ ...producto, url_imagen: response.data.secure_url });
        setUrlImagen(response.data.secure_url);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };
  
    const deleteImage = () => {
      setUrlImagen('');
    };

    const handleSnackbarClose = () => {
      setGuardadoExitoso(false);
    };


    return (
     
    

    <div className={styles.container}>
      <Box component="form" onSubmit={handleSubmit} sx={{ /* tus estilos MUI aquí */ }}>
      <h2>Formulario de Producto</h2>
      
      {/* Título */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Título"
          type="text"
          id="titulo"
          name="titulo"
          value={producto.titulo}
          onChange={handleInputChange}
          required
          fullWidth
        />
      </Box>

      {/* Autor */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Autor"
          type="text"
          id="autor"
          name="autor"
          value={producto.autor}
          onChange={handleInputChange}
          required
          fullWidth
        />
      </Box>

      {/* Precio */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Precio"
          type="number"
          id="precio_$"
          name="precio_$"
          value={precioValue}
          onChange={handleInputChange}
          required
          fullWidth
        />
      </Box>

      {/* Número de Páginas */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Número de Páginas"
          type="number"
          id="nro_paginas"
          name="nro_paginas"
          value={producto.nro_paginas}
          onChange={handleInputChange}
          required
          fullWidth
        />
      </Box>

      {/* Peso */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Peso"
          type="number"
          id="peso"
          name="peso"
          value={producto.peso}
          onChange={handleInputChange}
          fullWidth
        />
      </Box>

      {/* Fecha de Publicación */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Fecha de Publicación"
          type="date"
          id="fecha_publicacion"
          name="fecha_publicacion"
          value={producto.fecha_publicacion}
          onChange={handleInputChange}
          required
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      {/* ISBN */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="ISBN"
          type="text"
          id="ISBN"
          name="ISBN"
          value={producto.ISBN}
          onChange={handleInputChange}
          required
          fullWidth
          error={producto.ISBN.length !== 13 || isbnExists}
          helperText={(producto.ISBN.length !== 13 && "El ISBN debe tener 13 dígitos") || (isbnExists && "El ISBN ya existe en la base de datos")}
        />
      </Box>

      {/* Editorial */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Editorial"
          type="text"
          id="editorial"
          name="editorial"
          value={producto.editorial}
          onChange={handleInputChange}
          required
          fullWidth
        />
      </Box>

      {/* Idioma */}
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Idioma</InputLabel>
          <Select
            id="idioma"
            name="idioma"
            value={producto.idioma}
            onChange={handleInputChange}
            required
          >
            {/* Opciones de idioma */}
            <MenuItem value="Castellano">Castellano</MenuItem>
            {/* ...otros idiomas */}
          </Select>
        </FormControl>
      </Box>

      {/* Descripción */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Descripción"
          multiline
          rows={4}
          id="descripcion"
          name="descripcion"
          value={producto.descripcion}
          onChange={handleInputChange}
          fullWidth
        />
      </Box>

      {/* Categoría */}
      <Box sx={{ mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Categoría</InputLabel>
          <Select
            id="categoria"
            name="categoria"
            value={producto.categoria}
            onChange={handleCategoriaChange}
          >
            {/* Opciones de categoría */}
            {categorias.map((categoria) => (
              <MenuItem key={categoria.id} value={categoria.id}>{categoria.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Stock */}
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel component="legend">Stock</FormLabel>
        <RadioGroup
          row
          name="stock"
          value={producto.stock.toString()}
          onChange={handleInputChange}
        >
          <FormControlLabel value="true" control={<Radio />} label="Disponible" />
          <FormControlLabel value="false" control={<Radio />} label="No Disponible" />
        </RadioGroup>
      </FormControl>

      {/* Imagen */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          component="label"
        >
          Seleccionar Imagen
          <input
            type="file"
            hidden
            id="url_imagen"
            name="url_imagen"
            onChange={(e) => {
              handleInputChange(e);
              changeUploadImage(e);
            }}
            accept="image/*"
            required
          />
        </Button>
        {urlImagen && (
          <Box>
            <img src={urlImagen} alt="Imagen seleccionada" style={{ width: '100%', marginTop: '10px' }} />
            <Box>{urlImagen}</Box>
            <Button onClick={deleteImage}>Eliminar Imagen</Button>
          </Box>
        )}
      </Box>

      {/* Botón de envío */}
      <Box sx={{ mb: 2 }}>
        <Button type="submit" variant="contained" disabled={isbnExists || producto.ISBN.length !== 13}>
          Guardar Producto
        </Button>
      </Box>
    </Box>

{guardadoExitoso && (
        <Snackbar
          open={guardadoExitoso}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message="¡Producto guardado exitosamente!"
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      )}
</div>
);
            };    



export default PanelAdministrador;
