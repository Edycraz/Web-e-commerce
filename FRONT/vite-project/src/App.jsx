import React from 'react';
import './App.css';
import ListadoDeProductos from './components/Listado de Productos/ListadoDeProductos';
import SearchBar from './components/SearchBar/SearchBar';
import { Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Detail from './Views/Detail';
import Navbar from './components/NavBar/NavBar';
import MensajeSinLibros from './components/Mensaje sin libros/MensajeSinLibros';
import Login from './Views/Login';
import RegistroExitoso from './Views/RegistroExitoso';
import PanelAdministrador from './components/PanelAdministrador/PanelAdministrador';
import DashboardAdmin from './Views/DashboardAdmin';
import FormCategoria from './components/FormCategoria/FormCategoria';
import Filtros from './components/Filtros/Filtros';
import { Dashboard } from '@mui/icons-material';
import ProductTable from './components/ProductTable/ProductTable';
import VerCategorias from './components/Ver Categorias/VerCategorias';
import EditProduct from './components/Editar Producto/EditProduct';
import PATHROUTES from './helpers/PathRoutes.helper';
import MensajePago from './components/MensajePago/MensajePago';

import { CarritoProvider } from './providers/carritoContext';
import Footer from './components/Footer/Footer';


function App() {

  const [librosFiltrados, setLibrosFiltrados] = useState([]);
  const [precioMax, setPrecioMax] = useState(0); 
  const [filtroActual, setFiltroActual] = useState({ categoria: '', precio: 100000, ordenamiento: 'precio_desc' });

  useEffect(() => {
    fetch('https://bookfinderback.onrender.com')
      .then((response) => response.json())
      .then((data) => {
        setLibrosFiltrados(data);
        const maxPrecioEncontrado = data.reduce((max, libro) => Math.max(max, libro.precio_$), 0);
        const precioMaxConIncremento = maxPrecioEncontrado * 1.10; 
        const precioMaxRedondeado = Math.ceil(precioMaxConIncremento / 1000) * 1000;
        setPrecioMax(precioMaxRedondeado); 
      });
  }, []);

  const aplicarFiltro = () => {
    let queryParams = '';
    if (filtroActual.categoria) {
      queryParams += `categoria=${filtroActual.categoria}&`;
    }
    queryParams += `precio=${filtroActual.precio}&`;
    queryParams += `ordenamiento=${filtroActual.ordenamiento}`;

    fetch(`https://bookfinderback.onrender.com/?${queryParams}`)
      .then(response => response.json())
      .then(data => setLibrosFiltrados(data))
      .catch(error => console.error('Error:', error));
  };

  const onPriceChange = (precio) => {
    setFiltroActual(prevState => ({ ...prevState, precio: precio }));
    aplicarFiltro();
  };

  const handleFilterChange = (categoria) => {
    setFiltroActual(prevState => ({ ...prevState, categoria: categoria }));
    aplicarFiltro();
  };

  const onSortChange = (ordenamiento) => {
    setFiltroActual(prevState => ({ ...prevState, ordenamiento: ordenamiento }));
    aplicarFiltro();
  };

  const onSearchSubmit = (searchTerm) => {
    fetch(`https://bookfinderback.onrender.com/search?query=${encodeURIComponent(searchTerm)}`)
      .then(response => response.json())
      .then(data => setLibrosFiltrados(data))
      .catch(error => console.error('Error al buscar libros:', error));
  };

  useEffect(() => {
    aplicarFiltro(); // Aplica el filtro cada vez que cambia filtroActual
  }, [filtroActual]);

  const [isContactModalOpen, setContactModalOpen] = useState(false);

    const handleOpenContactModal = () => {
        setContactModalOpen(true);
    };

    const handleCloseContactModal = () => {
        setContactModalOpen(false);
    };

  return (
    <div style={{ marginTop: '70px', minHeight: '795px', backgroundColor: "#fff" }}>
      <CarritoProvider>
        <Navbar />
        <Routes>
          <Route path={"/"} element={
            <>
              <SearchBar onSearchSubmit={onSearchSubmit} />
              <Filtros 
                onFilterChange={handleFilterChange} 
                onPriceChange={onPriceChange}
                onSortChange={onSortChange} 
                precioMax={precioMax} 
              />
              {librosFiltrados.length > 0 ? 
                <ListadoDeProductos libros={librosFiltrados} /> :
                <MensajeSinLibros />
              }
              <Footer/>
            </>
          } />
          <Route path={'/detail/:id'} element={<Detail />} />
        <Route path={PATHROUTES.ADMINISTRADOR} element={<DashboardAdmin />} />

        <Route path={PATHROUTES.FORMPRODUCTOS} 
        element={
          <>
            <DashboardAdmin />
            <PanelAdministrador />
          </>
        }
        />

        <Route
          path={PATHROUTES.VERPRODUCTOS}
          element={
            <>
              <DashboardAdmin />
              <ProductTable />
            </>
          }
        />

        <Route
          path={PATHROUTES.FORMCATEGORIA}
          element={
            <>
              <DashboardAdmin />
              <FormCategoria />
            </>
          }
        />



        <Route
          path={PATHROUTES.VERCATEGORIAS}
          element={
            <>
              <DashboardAdmin />
              <VerCategorias />
            </>
          }
        />

        <Route
          path={PATHROUTES.EDITARPRODUCTO}
          element={
            <>
              <DashboardAdmin />
              <EditProduct />
            </>
          }
        />

          <Route path='/login' element={<Login/>}></Route>
          <Route path={'registroexitoso'} element={<RegistroExitoso/>}></Route>
          <Route path="/pago-exitoso" element={<MensajePago estado="exitoso" />} />
        <Route path="/pago-fallido" element={<MensajePago estado="fallido" />} />
        <Route path="/pago-pendiente" element={<MensajePago estado="pendiente" />} />
        </Routes>
      </CarritoProvider>
    </div>
  );
} 

export default App;
