import React, { useContext, useState, useEffect } from 'react';
import { CarritoContext } from '../../providers/carritoContext.jsx';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth0 } from '@auth0/auth0-react';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import logo from '../../assets/logo.png';
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
//import PasarelaDePago from '../Pasarela de pago/PasarelaDePago.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import Login from '../../Views/Login.jsx';
import { red } from '@mui/material/colors';
import { Error } from '@mui/icons-material';

import Snackbar from '@mui/material/Snackbar';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Navbar() {
  // Variables de autenticación y pbtención de credenciales
  const { isAuthenticated, user, logout } = useAuth0();
  const history = useNavigate()


  const signOut = () => {
    if (isAuthenticated) {
      logout();

    } else {
      localStorage.setItem("loggedIn", false);
      localStorage.setItem("userEmail", "");
      localStorage.setItem("userRol", "")
      history('/')
      window.location.reload();
    }
  };

  const getUserData = () => {
    if (isAuthenticated) {
      return user.name;
    } else {
      return localStorage.getItem("userEmail");
    }
  };





// ------------
// Modal login para protección de pago
const navigate = useNavigate();

const [modalLoginAbierto, setModalLoginAbierto] = useState(false)
const handleModalLogin = () => setModalLoginAbierto(!modalLoginAbierto)


// ---------------

  const { carrito, actualizarCantidad, removerDelCarrito, vaciarCarrito } = useContext(CarritoContext);  
  const [prevCartCount, setPrevCartCount] = useState(carrito.length);
  const [modalCarritoAbierto, setModalCarritoAbierto] = useState(false);
  const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
  const [mostrarBotonMercadoPago, setMostrarBotonMercadoPago] = useState(false);
  const manejarAbrirModalCarrito = () => setModalCarritoAbierto(true);
  const manejarCerrarModalCarrito = () => setModalCarritoAbierto(false);
  const manejarAbrirModalPago = () => {
    setModalCarritoAbierto(false);
    setModalPagoAbierto(true);
  };
  const manejarCerrarModalPago = () => setModalPagoAbierto(false);


  const handleSnackbarClose = () => {
  setSnackbarOpen(false); // Cierra el Snackbar
  };


 

  // Agrega el estado mostrarBotonPago al principio del componente
  const [mostrarBotonPago, setMostrarBotonPago] = useState(true);

  // Agrega el estado mostrarBotonMercadoPago al principio del componente

  const handleChangeCantidad = async (productoId, nuevaCantidad) => {
    actualizarCantidad(productoId, nuevaCantidad);
    await createPreference();
      // Muestra el botón de MercadoPago
    setMostrarBotonMercadoPago(false);
    // Muestra el botón "Generar botón de pago" nuevamente
    setMostrarBotonPago(true);

  };

  const precioTotalGeneral = carrito.reduce((total, producto) => {
    return total + (producto.precio_$ * (producto.cantidad || 1));
  }, 0);

  const [preferenceId, setPreferenceId] = useState(null);

  initMercadoPago("...");

  const createPreference = async () => {
    try {
      const items = carrito.map((producto) => ({
        title: producto.titulo,
        quantity: producto.cantidad || 1,
        currency_id: "ARS",
        unit_price: producto.precio_$
      }));
  
      const totalPrice = items.reduce((total, item) => total + (item.quantity * item.unit_price), 0);
  
      // Crear una lista de descripciones de libros con cantidad (si es más de 1)
      const bookDescriptions = carrito.map((producto) => {
        const cantidad = producto.cantidad || 1;
        return `${producto.titulo}${cantidad > 1 ? ` (${cantidad})` : ""}`;
      });
  
      const response = await fetch("https://bookfinderback.onrender.com/create_preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          description: `Compra de libros: ${bookDescriptions.join(", ")}`,
          price: totalPrice,
          quantity: 1,
          items: items
        })
      });
  
      if (response.ok) {
        const data = await response.json();
        const { id } = data;
        return id;
      } else {
        console.error("Error en la solicitud HTTP");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (carrito.length > prevCartCount) {
        // El carrito ha crecido, muestra el Snackbar
        setSnackbarOpen(true);
    }
    // Actualiza el conteo previo del carrito para la próxima comparación
    setPrevCartCount(carrito.length);

    // Resto de tu lógica...
    console.log("El carrito ha cambiado. Nueva longitud del carrito:", carrito.length);
    setMostrarBotonMercadoPago(false);
    setMostrarBotonPago(true);
}, [carrito]);

  const handleBuy = async () => {
    const id = await createPreference();
    if (id) {
      setPreferenceId(id);
      // Oculta el botón "Generar botón de pago"
      setMostrarBotonPago(false);
      setMostrarBotonMercadoPago(true);
    }
  };
  const userRole = localStorage.getItem("userRol");
  const redirectToLogin = () => {
    manejarCerrarModalCarrito();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
    {userRole === 'admin' && (
            <Button
              color="inherit"
              component={Link}
              to="/administrador"
            >
              Panel de Administración
            </Button>
          )}
      <AppBar position="fixed" sx={{ backgroundColor: '#2196F3' }}>
        <Toolbar >
     
          <Link to={localStorage.getItem("userRol") === 'admin' ? "#" : "/"}> {/* Agrega el enlace al inicio */}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
            </IconButton>
          </Link>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            component={Link}
            to="/"
          >
            <img src={logo} alt="Logo" />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Los mejores libros
          </Typography>
          <Typography variant="h7" component="div" sx={{ textAlign: 'right' }}>
            {localStorage.getItem("loggedIn") === "true" || isAuthenticated ? 'Hola ' + getUserData() : 'Hola invitado'}
          </Typography> 
          {localStorage.getItem("loggedIn") === "true" || isAuthenticated ?

           <Button color='inherit' onClick={signOut}> Cerrar sesión </Button> :
           <Link to={'/login'}><Button style={{ color: '#fff' }}>Iniciar sesión</Button></Link>
        }
         
          {localStorage.getItem("userRol") != 'admin' && 
           <IconButton aria-label="cart" onClick={manejarAbrirModalCarrito}>

            <StyledBadge badgeContent={carrito.length} color="secondary">
              <ShoppingCartIcon />
            </StyledBadge>
          </IconButton>
          }
        </Toolbar>
        <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Libro agregado al carrito"
        action={
          <React.Fragment>
            <Button color="primary" size="small" onClick={manejarAbrirModalCarrito} sx={{ color: 'white' }}>
              VER CARRITO
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Cambia la posición
        ContentProps={{
          sx: { backgroundColor: 'green' } // Cambia el estilo del contenido
        }}
      />
      </AppBar>

      <Modal color="primary" open={modalCarritoAbierto} onClose={manejarCerrarModalCarrito}>
  <Box sx={{ ...modalStyle, overflowY: 'auto', maxHeight: '800px', width: '85%', maxWidth: '600px',  }}>
    <IconButton
      aria-label="close"
      onClick={manejarCerrarModalCarrito}
      sx={{ position: 'absolute', right: 8, top: 8 }}
    >
      <CloseIcon />
    </IconButton>
    <Typography id="carrito-modal-titulo" variant="h6" component="h2">
      Carrito de Compras
    </Typography>
    {carrito.length === 0 && (
      <Alert severity="info" sx={{ mt: 2 }}>
        Tu carrito está vacío.
      </Alert>
    )}
    {/* Ajuste aquí para la lista deslizable */}
    <List sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: '400px', overflowY: 'auto' }}>
      {carrito.map((producto, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={producto.titulo}
                  secondary={`Precio Unitario: ${producto.precio_$}`}
                />
                <TextField
                  label="Cantidad"
                  type="number"
                  variant="outlined"
                  size="small"
                  value={producto.cantidad || 1}
                  onChange={(e) => handleChangeCantidad(producto.id, parseInt(e.target.value, 10))}
                  sx={{ width: '90px', marginRight: '10px' }}
                />
                <IconButton edge="end" aria-label="delete" onClick={() => removerDelCarrito(producto.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          {carrito.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Total: {precioTotalGeneral} AR$
              </Typography>
              <Button
                onClick={localStorage.getItem("loggedIn") === "true" || isAuthenticated ? handleBuy : redirectToLogin}
                style={{ 
                  backgroundColor: '#009ee3', 
                  color: '#ffffff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '5px',
                  height: '50px',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '16px',
                  width: '100%',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  lineHeight: '18px',
                  fontSize: '15px',
                  fontWeight: 600,
                  position: 'relative',
                  display: mostrarBotonPago ? 'block' : 'none' // Ajusta la visualización según la condición
                }}
              >
                Finalizar Compra
              </Button>
              <Button style={{ display: mostrarBotonMercadoPago ? 'block' : 'none', width: '100%', }}>
                {preferenceId && <Wallet initialization={{ preferenceId }} />}
              </Button>
            </>
          )}
        </Box>
      </Modal>

      <Modal open={modalLoginAbierto} onClose={handleModalLogin}>
       <Box sx={{ ...modalStyle, overflowY: 'auto', maxHeight: '600px', width: '70%', maxWidth: '400px',  }}>
        <Typography sx={{ color: red[500] }}>
            <Error sx={{ color: red[500] }}/>
            Debe iniciar sesión para continuar.
        </Typography>
         <Login isModal={true} closeLoginModal={handleModalLogin} />
       </Box>
      </Modal>
      
    </Box>
  );
}

