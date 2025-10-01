import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

/**
 * Manejador de errores centralizado
 */
export class ErrorHandler extends HttpException {
  private static readonly logger = new Logger(ErrorHandler.name);

  constructor(message: string, status?: HttpStatus) {
    super(message, status || HttpStatus.BAD_REQUEST);
  }

  /**
   * Método único para manejar todos los tipos de errores
   * @param error El error a manejar
   * @param context El contexto donde ocurrió el error (ej: 'UserService.create')
   * @param extraData Datos adicionales para el mensaje de error
   */
  static handle(error: any, context?: string, extraData?: any): never {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';

    // Log del contexto si existe
    const contextStr = context ? ` en ${context}` : '';

    // Manejo de errores de base de datos
    if (error instanceof QueryFailedError) {
      const pgError = error.driverError as any;
      if (pgError?.code) {
        switch (pgError.code) {
          case '23505': // Duplicado
            status = HttpStatus.CONFLICT;
            message = 'El registro ya existe';
            break;
          case '23503': // FK violation
            status = HttpStatus.BAD_REQUEST;
            message = 'Referencia a registro inexistente';
            break;
          case '23502': // Not null
            status = HttpStatus.BAD_REQUEST;
            message = 'Campo requerido faltante';
            break;
          default:
            message = 'Error en la base de datos';
        }
      }
    }
    // Manejo de recurso no encontrado
    else if (error instanceof EntityNotFoundError || error?.status === HttpStatus.NOT_FOUND) {
      status = HttpStatus.NOT_FOUND;
      message = extraData?.id
        ? `${extraData.resource || 'Registro'} con ID ${extraData.id} no encontrado`
        : `${extraData?.resource || 'Registro'} no encontrado`;
    }
    // Manejo de errores HTTP existentes
    else if (error instanceof HttpException) {
      status = error.getStatus();
      message = error.message;
    }
    // Manejo de errores de validación
    else if (error?.name === 'ValidationError') {
      status = HttpStatus.BAD_REQUEST;
      message = 'Datos de entrada inválidos';
    }
    // Errores de JS comunes (TypeError, ReferenceError, etc.)
    else if (
      error instanceof TypeError ||
      error instanceof ReferenceError ||
      error instanceof SyntaxError
    ) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error interno del servidor';
    }
    // Si el error tiene un mensaje, usarlo (solo si no es error interno)
    else if (error?.message && status < 500) {
      message = error.message;
    }

    // Log del error
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`Error${contextStr}: ${message}`);
      // Solo loguea el stack trace en consola, no lo envía al cliente
      if (error?.stack) {
        // Puedes comentar la siguiente línea si no quieres ver el stack en consola
        console.error(error.stack);
      }
    } else if (status >= HttpStatus.BAD_REQUEST) {
      this.logger.warn(`Warning${contextStr}: ${message}`);
    } else {
      this.logger.log(`Info${contextStr}: ${message}`);
    }

    // Lanzar el error con formato estandarizado
    throw new ErrorHandler(message, status);
  }

  /**
   * Helper para validar existencia de recursos
   */
  static validateExists<T>(value: T | null | undefined, resource: string, id?: string): T {
    if (!value) {
      this.handle(new Error('Not Found'), undefined, { resource, id });
    }
    return value as T;
  }
}
