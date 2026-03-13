import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateAvailability,
  updateProduct,
} from './handlers/product.js';
import { handleInputErrors } from './middlewares/handleInputErrors.js';

const router = Router();

/**
 * En Express todo lo que va después de la ruta (los handlers) son middlewares
 * Entonces es conveniente pensar que hay middlewares de lógica de negocio y
 * otros de válidación de peticiones HTTP
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      properties:
 *        id:
 *          type: interger
 *          description: The product ID
 *          example: 1
 *        name:
 *          type: string
 *          description: The product name
 *          example: Monitor Curvo de 49 pulgadas
 *        price:
 *          type: number
 *          description: The product price
 *          example: 325.75
 *        availability:
 *          type: boolean
 *          description: The product availability
 *          example: true
 */

/**
 * @swagger
 * /api/products:
 *  get:
 *    summary: Get a list of products
 *    tags:
 *      - Products
 *    description: Return a list of products
 *    responses:
 *      200:
 *        description: Succesful response
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *              $ref: '#/components/schemas/Product'
 */
router.get('/', getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *    summary: Get a product by ID
 *    tags:
 *      - Products
 *    description: Return a product based on its unique ID
 *    parameters:
 *      - in: path
 *        name: id
 *        description: The ID of the product to retrieve
 *        requiered: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Succesful response
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *              $ref: '#/components/schemas/Product'
 *      400:
 *        description: Bad request - Invalid ID
 *      404:
 *        description: Not found
 */
router.get(
  '/:id',
  param('id').isInt().withMessage('ID inválido'),
  handleInputErrors,
  getProductById,
);

/**
 * @swagger
 * /api/products:
 *  post:
 *    summary: Creates a new product
 *    tags:
 *      - Products
 *    description: Returns a new record in the database
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: "Monitor Curvo 49 Pulgadas"
 *              price:
 *                type: number
 *                example: 399
 *    responses:
 *      201:
 *        description: Successful response
 *        content:
 *          application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *      400:
 *        description: Bad Request - invalid input data
 */
router.post(
  '/',
  body('name')
    .notEmpty()
    .withMessage('El nombre del producto no puede ir vacío'),
  body('price')
    .notEmpty()
    .withMessage('El precio del producto no puede ir vacío')
    .bail()
    .isFloat({ gt: 0 })
    .withMessage('El precio debe ser un número y mayor a 0'),
  handleInputErrors,
  createProduct,
);

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *    summary: Updates a product with user input
 *    tags:
 *      - Products
 *    description: Returns the updated product
 *    parameters:
 *      - in: path
 *        name: id
 *        description: The ID of the product to retrieve
 *        required: true
 *        schema:
 *          type: integer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: "Monitor Curvo 49 Pulgadas"
 *              price:
 *                type: number
 *                example: 399
 *              availability:
 *                type: boolean
 *                example: true
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      400:
 *        description: Bad Request - Invalid ID or Invalid input data
 *      404:
 *        description: Product Not Found
 */
router.put(
  '/:id',
  param('id').isInt().withMessage('ID inválido'),
  body('name')
    .notEmpty()
    .withMessage('El nombre de Producto no puede ir vacio'),
  body('price')
    .notEmpty()
    .withMessage('El precio del producto no puede ir vacío')
    .isNumeric()
    .withMessage('El precio debe ser un número')
    .custom((value) => value > 0)
    .withMessage('Precio inválido'),
  body('availability')
    .isBoolean()
    .toBoolean()
    .withMessage('Valor para disponibilidad inválido'),
  handleInputErrors,
  updateProduct,
);

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *    summary: Update Product availability
 *    tags:
 *      - Products
 *    description: Returns the updated availability
 *    parameters:
 *      - in: path
 *        name: id
 *        description: The ID of the product to retrieve
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      400:
 *        description: Bad Request - Invalid ID
 *      404:
 *        description: Product Not Found
 */
router.patch(
  '/:id',
  param('id').isInt().withMessage('ID inválido'),
  handleInputErrors,
  updateAvailability,
);

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *    summary: Deletes a product by a given ID
 *    tags:
 *      - Products
 *    description: Returns a confirmation message
 *    parameters:
 *      - in: path
 *        name: id
 *        description: The ID of the product to delete
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *              value: 'Producto Eliminado'
 *      400:
 *        description: Bad Request - Invalid ID
 *      404:
 *        description: Product Not Found
 */
router.delete(
  '/:id',
  param('id').isInt().withMessage('ID inválido'),
  handleInputErrors,
  deleteProduct,
);

export default router;
