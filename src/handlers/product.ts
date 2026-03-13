import type { Request, Response } from 'express';
import Product from '../models/Product.js';

export const getProducts = async (req: Request, res: Response) => {
  const products = await Product.findAll({
    order: [['price', 'DESC']],
  });

  res.json({ data: products });
};

export const getProductById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({
      error: 'Producto no encontrado',
    });
  }

  res.json({ data: product });
};

export const createProduct = async (req: Request, res: Response) => {
  // Si esto falla, Express 5 lo manda automáticamente al middleware global
  // por eso no es necesario un try catch
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  await product.update(req.body);

  res.json({ data: product });
};

export const updateAvailability = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  await product.update({ availability: !product.availability });

  res.json({ data: product });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  await product.destroy();

  res.json({ data: 'Producto eliminado' });
};
