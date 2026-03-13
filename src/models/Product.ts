import {
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
} from 'sequelize';
import db from '../config/db.js';

// La definición del modelo crea la tabla y además ayuda al autocompletado
class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare price: number;
  declare availability: CreationOptional<boolean>; // También es opcional si tiene defaultValue
}

Product.init(
  {
    // Atributos (Columnas)
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false, // Opcional: define si permite nulos
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    availability: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    // Opciones del modelo
    sequelize: db, // Instancia de conexión
    tableName: 'products',
    modelName: 'Product',
  },
);

export default Product;
