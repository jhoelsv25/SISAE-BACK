import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * ErrorHandler - Clase personalizada para manejo de errores
 * Extiende HttpException de NestJS para mantener compatibilidad
 */
export class ErrorHandler extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    public readonly context?: string,
  ) {
    super(
      {
        message,
        statusCode,
        context,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }

  /**
   * Método estático para validar si una entidad existe
   * @param entity - La entidad a validar
   * @param entityName - El nombre de la entidad (para el mensaje de error)
   * @param id - El ID que se estaba buscando (opcional)
   * @returns La entidad si existe
   * @throws ErrorHandler si la entidad no existe
   */
  static validateExists<T>(entity: T | null | undefined, entityName: string, id?: string): T {
    if (!entity) {
      const message = id
        ? `${entityName} con ID "${id}" no encontrado`
        : `${entityName} no encontrado`;
      throw new ErrorHandler(message, HttpStatus.NOT_FOUND, entityName);
    }
    return entity;
  }

  /**
   * Método estático para errores de validación
   */
  static validation(message: string, context?: string): never {
    throw new ErrorHandler(message, HttpStatus.BAD_REQUEST, context);
  }

  /**
   * Método estático para errores de conflicto (duplicados)
   */
  static conflict(message: string, context?: string): never {
    throw new ErrorHandler(message, HttpStatus.CONFLICT, context);
  }

  /**
   * Método estático para errores de no autorizado
   */
  static unauthorized(message: string = 'No autorizado', context?: string): never {
    throw new ErrorHandler(message, HttpStatus.UNAUTHORIZED, context);
  }

  /**
   * Método estático para errores de prohibido (sin permisos)
   */
  static forbidden(message: string = 'No tienes permisos', context?: string): never {
    throw new ErrorHandler(message, HttpStatus.FORBIDDEN, context);
  }

  /**
   * Método estático para errores internos del servidor
   */
  static internal(message: string = 'Error interno del servidor', context?: string): never {
    throw new ErrorHandler(message, HttpStatus.INTERNAL_SERVER_ERROR, context);
  }

  /**
   * Método estático para capturar errores desconocidos
   */
  static handleUnknownError(error: any, defaultMessage: string = 'Error inesperado'): never {
    // Si ya es un ErrorHandler, re-lanzarlo
    if (error instanceof ErrorHandler) {
      throw error;
    }

    // Si es una HttpException de NestJS, re-lanzarla
    if (error instanceof HttpException) {
      throw error;
    }

    // Si es un error de base de datos o cualquier otro, lanzar error interno
    console.error('Error no manejado:', error);
    throw new ErrorHandler(
      defaultMessage,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error?.constructor?.name,
    );
  }
}
