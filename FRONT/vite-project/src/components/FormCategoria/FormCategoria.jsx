

import React, { useState } from 'react';
import { TextField, Button, Paper } from '@mui/material';
import { styled } from '@mui/system';

const ResponsivePaper = styled(Paper)(({ theme }) => ({
  maxWidth: '100%',
  margin: 'auto',
  padding: theme.spacing(2),
  marginTop: theme.spacing(4),
}));

const FormContainer = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});




const FormCategoria = () => {
  const [nombre, setNombre] = useState('');

  const handleNombreChange = (event) => {
    setNombre(event.target.value);
  };

  const checkExistingCategory = async () => {
    try {
      const response = await fetch(`https://bookfinderback.onrender.com/categorias/check?nombre=${nombre}`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Respuesta del servidor:" + data);
        // Devuelve true si la categoría ya existe, de lo contrario, false.
        return data.exists
      } else {
        console.error('Error al verificar la existencia de la categoría');
        return false;
      }
    } catch (error) {
      console.error('Error de red:', error);
      return false;
    }
  };

  const resetForm = () => {
    setNombre('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const existencia = await checkExistingCategory();
    console.log("Existencia:" + existencia)

    if (existencia) {
      alert('La categoría ya existe. Por favor, elige otro nombre.');
      return; // Cancelar el proceso si la categoría ya existe.
    }

    const confirmacion = window.confirm('¿Confirmar la creación de la categoría con este nombre?');

    if (confirmacion) {
      try {
        const response = await fetch('https://bookfinderback.onrender.com/categoria', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nombre }),
        });

        if (response.ok) {
          console.log('Categoría creada exitosamente');
          const aviso = window.alert("La categoría se creó exitosamente")
          resetForm();
  
        } else {
          console.error('Error al crear la categoría');
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    } else {
      console.log('Creación de categoría cancelada por el usuario');
    }
  };

  return (
    <ResponsivePaper elevation={3}>
      <FormContainer onSubmit={handleSubmit}>
        <TextField
          label="Nombre de la categoría"
          variant="outlined"
          value={nombre}
          onChange={handleNombreChange}
        />
        <Button type="submit" variant="contained" color="primary">
          Crear Categoría
        </Button>
      </FormContainer>
    </ResponsivePaper>
  );
};

export default FormCategoria;

