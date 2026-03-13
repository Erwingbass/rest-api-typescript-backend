// index es el archivo que inicia el proyecto
// El flujo es: index.ts → server.ts → connectDB() → db.sync()
import colors from 'colors';
import server from './server.js';

const port = process.env.PORT || 4000;

// Levantar el servidor
server.listen(port, () => {
  // console.log(process.env);
  console.log(colors.cyan.bold(`REST API en el puerto ${port}`));
});
