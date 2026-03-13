import express from 'express';
import colors from 'colors';
import db from './config/db.js';
import './models/Product.js'; // Importar para que se ejecute Product.init()
import router from './router.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec, { swaggerUiOptions } from './config/swagger.js';
import { globalErrorHandler } from './middlewares/errorHandler.js';
import cors, { type CorsOptions } from 'cors';

export async function connectDB() {
  try {
    await db.authenticate();
    await db.sync(); // Crea tablas si no existen

    // console.log(colors.blue('Conexión exitosa a la BD'));
  } catch (error) {
    // console.log(error)
    console.log(colors.red.bold('Hubo un error en al conectar la BD'));
  }
}
connectDB();

// Instancia de express
const server = express(); // O tambien se puede llamar app

/**
 * * Permitir que el frontend consuma la API
 * * CORS no es una medida de seguridad para proteger el servidor, es una medida de seguridad para proteger
 * * a los usuarios en sus navegadores.
 * Cuando el frontend hace una petición el navegador inyecta la cabecera Origin, si el servidor rechaza
 * ese origen, el navegador bloquea la respuesta. Esto evita que una web maliciosa ej. sitio-hacker.com,
 * haga peticiones a la API haciéndose pasar por un usuario que dejó su sesión abierta.
 *
 * Herramientas como Postman, ThunderClient o Apps móviles no envian la cabecera Origin por defecto,
 * por lo que llega como undefined. A CORS no le importa por que no es un usuario con un navegador
 * al cual deba proteger contra ataques Cross Site (XSS), de hecho, es buena práctica dejar que
 * "undefined" envíe peticiones
 * */
const whiteList = [process.env.FRONTEND_URL];
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Error de CORS'));
    }
  },
};

server.use(cors(corsOptions));

// Leer datos de formularios, middleware para JSON
server.use(express.json());

/**
 * * Montamos el router en la ruta base "/"
 * Todas las rutas definidas dentro de `router` estarán disponibles
 * desde "/"
 * Ejemplo:
 * router.get('/')      ->  GET /
 * router.get('/api')   ->  GET /api
 *
 * * Si en lugar de '/' usamos '/api':
 * server.use('/api', router);
 *
 * Express agrega automáticamente ese prefijo a todas las rutas:
 * router.get('/')          ->  GET /api
 * router.get('/products')  ->  GET /api/products
 * Es decir, el primer argumento de use() funciona como un prefijo global.
 */
server.use('/api/products', router);

// El manejador global de errores va después de la rutas.
server.use(globalErrorHandler);

server.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions),
);

export default server;
