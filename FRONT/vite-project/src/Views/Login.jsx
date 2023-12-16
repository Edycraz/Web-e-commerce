import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Snackbar, Button, FormControl, InputLabel, MenuItem, Select, TextField, Alert} from '@mui/material';
import { Google } from '@mui/icons-material';

const Login = (props) => {
  const { isModal, closeLoginModal } = props;
  const { loginWithRedirect } = useAuth0();
  const [errorMessage, setErrorMessage] = useState({ message: '' });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [countdown, setCountdown] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (openSnackbar && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      handleSnackbarClose();
    }
    return () => clearTimeout(timer);
  }, [openSnackbar, countdown]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
    setCountdown(6);
    navigate('/');
  };

  const [isSignedUp, setIsSignedUp] = useState(true);
  const handleLogin = (e) => {
    e.preventDefault();
    setIsSignedUp(!isSignedUp);
  };

  const [userData, setUserData] = useState({
    mail: "",
    password: "",
    rol: ""
  });

  const handleChange = (event) => {
    const property = event.target.name;
    const value = event.target.value;
    setUserData({ ...userData, [property]: value });
  };

  const submit = (e) => {
    e.preventDefault();

    if (isSignedUp) {
      
      fetch('https://bookfinderback.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mail: userData.mail,
          password: userData.password
        }),
      })
      .then((res) => res.json())
      .then((res) => {
        if (res === 'Faltan datos') {
          setErrorMessage({
            message: 'Todos los campos deben ser completados'
          });
        } else if (res === 'Datos incorrectos') {
          setErrorMessage({
            message: 'Los datos son incorrectos. Vuelva a intentarlo.'
          });
        } else {
          localStorage.setItem("loggedIn", true);
          localStorage.setItem("userEmail", res.mail);
          localStorage.setItem("userRol", res.rol);
          if (res.rol === 'admin') {
            navigate('/administrador'); // Usando navigate en lugar de history.push
          } else if (!isModal) {
            navigate("/"); // Usando navigate
          } else {
            closeLoginModal();
          }
        }
      })
      .catch((error) => console.log(error));
    } else {
      // Lógica para registro
      fetch('https://bookfinderback.onrender.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mail: userData.mail,
          password: userData.password,
          rol: userData.rol
        }),
      })
      .then((res) => res.json())
      .then((res) => {
        if (res === 'Faltan datos') {
          setErrorMessage({
            message: 'Todos los campos deben ser completados'
          });
        } else if (res === 'Registro exitoso') {
          // Mostrar Snackbar en lugar de navegar
          setOpenSnackbar(true);
        }
      })
      .catch((error) => console.log(error));
    }
  };


  return (
    <div>
      <form onSubmit={submit}>
        <h1>{isSignedUp ? 'Login' : 'Sign Up'}</h1>
        <TextField id="email" label="Email" variant="outlined" name='mail' value={userData.mail} onChange={handleChange}/>
        <br /><br />
        <TextField id="pass" label="Contraseña" variant="outlined" name='password' type='password' value={userData.password} onChange={handleChange}/>
        <br />
        {!isSignedUp &&
          <div>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Elija su rol...</InputLabel>
              <Select labelId="demo-simple-select-standard-label" id="demo-simple-select-standard" name='rol' onChange={handleChange} value={userData.rol} label="Rol">
                <MenuItem value={'cliente'}>Cliente</MenuItem>
                <MenuItem value={'admin'}>Vendedor</MenuItem>
              </Select>
            </FormControl>
          </div>
        }
        <h4>{errorMessage.message}</h4> <br />
        <Button variant='contained' type='submit' color='success'> Enviar</Button> <br /> <br />
        <Button variant='outlined' startIcon={<Google />} onClick={loginWithRedirect}> Ingresar con Google </Button>
        <h4>{isSignedUp ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}</h4>
        <Button onClick={handleLogin} variant='contained'>{isSignedUp ? 'Registrarse' : 'Iniciar sesión'}</Button>
      </form>

      <Snackbar
        open={openSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success" 
          sx={{ 
            width: '100%',
            backgroundColor: 'green', // Fondo verde
            color: 'white' // Letra blanca
          }}
        >
          Registro exitoso!. Será redirigido en {countdown} segundos, ahora puede iniciar sesión con sus datos registrados. 
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Login;
