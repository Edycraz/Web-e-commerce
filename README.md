# BookFinder

Bienvenido a **BookFinder**, una aplicación web que te permite descubrir y explorar una amplia variedad de libros y autores. Ya sea que estés buscando tu próxima lectura o quieras conocer más sobre tus autores favoritos, "BookFinder" está aquí para ayudarte.

## Características Principales

- **Búsqueda de Libros:** Encuentra libros por título, autor o género.

- **Filtros Avanzados:** Refina tus búsquedas utilizando filtros avanzados como precio, calificación y más.

- **Información Detallada:** Obtén detalles completos sobre libros, incluyendo sinopsis, autor y calificaciones de usuarios.

- **Gestión de Libros Favoritos:** Marca tus libros favoritos y guárdalos para futuras referencias.

## Tecnologías Utilizadas

- **Frontend:** Desarrollado en React.js con Material-UI para la interfaz de usuario.

- **Backend:** Node.js y Express.js para la lógica del servidor.

- **Base de Datos:** PostgreSQL con Sequelize como ORM.

- **Autenticación:** Utiliza tokens JWT para la autenticación de usuarios.

## Requisitos de Instalación

- Node.js y npm instalados en tu sistema.

- Una base de datos PostgreSQL configurada.

## Instrucciones de Uso

1. Clona este repositorio en tu máquina local.

2. Instala las dependencias del proyecto utilizando `npm install` tanto en el directorio raíz como en el directorio `/frontend`.

3. Configura la conexión a tu base de datos PostgreSQL en el archivo `.env` (puedes utilizar el archivo `.env.example` como referencia).

4. Actualiza la variable de entorno `REACT_APP_MERCADOPAGO_API_KEY` en el archivo `.env` en el directorio `/frontend` con tu API Key de MercadoPago.

5. Ejecuta el servidor backend con `npm start` en el directorio raíz.

6. Ejecuta la aplicación frontend con `npm start` en el directorio `/frontend`.

7. Abre tu navegador y accede a `http://localhost:3000` para empezar a utilizar "BookFinder".

**Nota**: La conexión con MercadoPago no funcionará hasta que agregues tus propias credenciales. Asegúrate de agregar tu Access Token de MercadoPago en el archivo `server.js` en la línea 20 y tu API Key de MercadoPago en el componente `Nav.jsx` en la línea 135.

## Contribución

¡Estamos abiertos a contribuciones! Si deseas colaborar en el desarrollo de "BookFinder", por favor sigue estos pasos:

1. Crea un fork del repositorio.

2. Realiza tus cambios y mejoras en tu fork.

3. Envía un pull request con tus cambios.

4. Revisaremos tus contribuciones y las fusionaremos en el proyecto principal.

## Licencia

Este proyecto está bajo la licencia MIT. Siéntete libre de utilizarlo y modificarlo de acuerdo con tus necesidades.

## Contacto

Si tienes preguntas o sugerencias, no dudes en ponerte en contacto con nosotros en [tu dirección de correo electrónico] o a través de [tu sitio web].

¡Esperamos que disfrutes utilizando "BookFinder"!

