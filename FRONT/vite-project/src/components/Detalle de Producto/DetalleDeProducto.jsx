import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, IconButton, Typography, Button, Modal, Box, Tooltip, Skeleton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { AddShoppingCart } from '@mui/icons-material';
import accounting from 'accounting';
import Detail from './../../Views/Detail.jsx';
import { CarritoContext } from '../../providers/carritoContext.jsx';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
})); 

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 5,
  pt: 2,
  px: 4,
  pb: 3,
};

const cardStyle = {
  transition: "transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
  "&:hover": {
    transform: "scale(1.07)", 
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
};

function DetalleDeProducto(props) {
  const { agregarAlCarrito, removerDelCarrito, carrito } = useContext(CarritoContext);
  const { id, titulo, autor, precio_$, url_imagen, nro_paginas, peso, fecha_publicacion, ISBN, editorial, idioma, descripcion } = props;
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const estaEnCarrito = carrito.some(item => item.id === id);

  const manejarAgregarAlCarrito = () => {
    agregarAlCarrito({ id, titulo, precio_$ });
  };

  const manejarRemoverDelCarrito = () => {
    removerDelCarrito(id);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card sx={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {!url_imagen ? (
        <Skeleton variant="rectangular" height={400} width={700} />
      ) : (
        <CardMedia
          component="img"
          height="400"
          width="700"
          image={url_imagen}
          alt="Portada"
        />
      )}

      <CardHeader
        title={!titulo ? <Skeleton variant="text" width="40%" /> : <Typography variant='h5'>{titulo}</Typography>}
        subheader={!autor ? <Skeleton variant="text" width="30%" /> : <Typography variant='body2' color='textSecondary' noWrap>{autor}</Typography>}
      />

      <CardContent sx={{ flexGrow: 1, padding: 2 }}>
        {!precio_$ ? (
          <Skeleton variant="text" width="20%" />
        ) : (
          <Typography variant='h5' color='textSecondary'>
            {accounting.formatMoney(precio_$, { precision: 0 })}
          </Typography>
        )}
        
      </CardContent>

      <CardActions disableSpacing>
        {estaEnCarrito ? (
          <Tooltip title="Quitar del carrito">
            <IconButton aria-label="remove from cart" onClick={manejarRemoverDelCarrito} sx={{ color: 'red' }}>
              <RemoveShoppingCartIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Agregar al carrito">
            <IconButton aria-label="add to cart" onClick={manejarAgregarAlCarrito} sx={{ color: 'green' }}>
              <AddShoppingCart fontSize='large' />
            </IconButton>
          </Tooltip>
        )}

        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
        <Button onClick={handleOpen}>Ver detalle</Button>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography>Argumento:</Typography>
          {!descripcion ? <Skeleton variant="text" /> : <Typography>{descripcion}</Typography>}
        </CardContent>
      </Collapse>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: '70%',
                 maxWidth: "700px",
                 maxHeight: "600px",
                 display: 'flex',       
                 flexDirection: 'column', 
                 alignItems: 'center',   
                 justifyContent: 'center' }}>
          <Detail
            id={id}
            titulo={titulo}
            autor={autor}
            precio_$={precio_$}
            url_imagen={url_imagen}
            nro_paginas={nro_paginas}
            peso={peso}
            fecha_publicacion={fecha_publicacion}
            ISBN={ISBN}
            editorial={editorial}
            idioma={idioma}
            descripcion={descripcion}
          />
          <Button onClick={handleClose}>CERRAR</Button>
        </Box>
      </Modal>
    </Card>
  );
}

export default DetalleDeProducto;
