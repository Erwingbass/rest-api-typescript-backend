import { exit } from 'node:process';
import db from '../config/db.js';

const clearDB = async () => {
  try {
    await db.sync({ force: true });
    console.log('Datos eliminados correctamente');
    exit(0);
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

if (process.argv.includes('--clear')) {
  clearDB();
}
