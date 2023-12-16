
import React from 'react';
import { useNavigate } from 'react-router-dom';



const MensajePago = ({ estado }) => {
    let mensaje;
    switch (estado) {
      case "exitoso":
        mensaje = "Gracias por tu compra. Pronto nos pondremos en contacto para ultimar los detalles.";
        break;
      case "fallido":
        mensaje = "El pago no se pudo realizar. Por favor, intenta nuevamente.";
        break;
      case "pendiente":
        mensaje = "Tu pago está pendiente. Por favor, espera a que se procese.";
        break;
      default:
        mensaje = "Bienvenido de vuelta.";
    }

    return (
        <div>
          <h1>{mensaje}</h1>
          {/* ... otros elementos del UI */}
        </div>
      );
    };

    export default MensajePago;