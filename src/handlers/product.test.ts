import server from '../server.js';
import request from 'supertest'; // testear endpoints HTTP en Express.
import { describe, expect, it } from 'vitest';
import Product from '../models/Product.js';

// ? Info: "errors" es retornado por el middleware handleInputErrors (validación de errores)
// ? Info: "error" es retornado por el controller cuando la lógica de negocio falla

describe('POST /api/products', () => {
  it('Should display validation errors', async () => {
    const response = await request(server).post('/api/products').send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(2);
  });

  it('Should fail if price is negative', async () => {
    const response = await request(server).post('/api/products').send({
      name: 'Monitor curvo',
      price: -1,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(1);
  });

  it('Should validate that the price is a number', async () => {
    const response = await request(server).post('/api/products').send({
      name: 'Monitor curvo',
      price: 'Hola',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(1);
  });

  it('Should create a new product', async () => {
    const response = await request(server).post('/api/products').send({
      name: 'Mouse testing',
      price: 80.42,
    });

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('data');

    const createdProductId = response.body.data.id;
    await request(server).delete(`/api/products/${createdProductId}`);
  });
});

describe('GET /api/products', () => {
  it('Should check if api/products url exist', async () => {
    const response = await request(server).get('/api/products');
    expect(response.status).not.toBe(404);
  });

  it('GET a JSON response with products', async () => {
    const response = await request(server).get('/api/products');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('data');
    // expect(response.body.data).toHaveLength(1); // En caso de borrar la bd para pruebas o de tener una BD de Tests
    expect(response.body).not.toHaveProperty('errors');
  });
});

describe('GET /api/products/:id', () => {
  it('Should return a 404 response for a non-existent product', async () => {
    const productId = 10000;
    const response = await request(server).get(`/api/products/${productId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Producto no encontrado');
  });

  it('Should check a valid ID in the URL', async () => {
    const response = await request(server).get('/api/products/no-valid-url');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe('ID inválido');
  });

  it('Get a JSON response for a single product', async () => {
    const response = await request(server).get('/api/products/10');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
  });
});

describe('PUT /api/products/:id', () => {
  it('Should check a valid ID in the URL', async () => {
    const response = await request(server)
      .put('/api/products/no-valid-id')
      .send({
        name: 'Monitor curvo',
        availability: true,
        price: 300,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe('ID inválido');
  });

  it('Should display validation error messages when updating a product', async () => {
    const response = await request(server).put('/api/products/2').send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(5);

    expect(response.body).not.toHaveProperty('data');
  });

  it('Should validate that the price is greater than 0', async () => {
    const response = await request(server).put('/api/products/2').send({
      name: 'Monitor Curvo',
      availability: true,
      price: 0,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe('Precio inválido');
  });

  it('Should return a 404 response for a non-existent product', async () => {
    const productId = 10000;
    const response = await request(server)
      .put(`/api/products/${productId}`)
      .send({
        name: 'Monitor Curvo',
        availability: true,
        price: 300,
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Producto no encontrado');
  });

  it('Should update an existing product with valid data', async () => {
    const response = await request(server).put('/api/products/10').send({
      name: 'Actualizado testing',
      availability: true,
      price: 560,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
  });
});

describe('PATCH /api/products/:id', () => {
  it('Should return a 404 response for a non-existing product', async () => {
    const productId = 10000;
    const response = await request(server).patch(`/api/products/${productId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Producto no encontrado');
  });

  it('Should update the product availability', async () => {
    const response = await request(server).patch('/api/products/10');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
  });
});

describe('DELETE /api/products/:id', () => {
  it('Should check a valid ID', async () => {
    const response = await request(server).delete('/api/products/no-valid-id');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].msg).toBe('ID inválido');
  });

  it('Should return a 404 response for a non-existent product', async () => {
    const productId = 10000;
    const response = await request(server).delete(`/api/products/${productId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Producto no encontrado');
  });

  it('Should delete a product', async () => {
    const product = await Product.create({
      name: 'Test',
      price: 100,
    });

    const response = await request(server).delete(
      `/api/products/${product.id}`,
    );

    expect(response.status).toBe(200);
  });
});
