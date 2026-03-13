import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Carga los datos de .env

const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  // logging: console.log, // Mostrar queries, solo en desarrollo
  // logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export default db;
