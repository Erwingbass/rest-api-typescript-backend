import { Request, Response, NextFunction } from 'express';

/**
 * Si una función async lanza un error o una promesa es rechazada, Express
 * 5 lo captura automáticamente y lo envía al flujo de errores.
 *
 * Sin embargo, para que el cliente reciba una respuesta personalizada, se
 * necesita un Middleware Global de
 * Errores.
 */
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err.stack);

  res.status(500).json({
    errors: 'Hubo un error en el servidor',
    msg: err.message,
  });
};
