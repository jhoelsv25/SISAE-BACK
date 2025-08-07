import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

/**
 * Clase para manejo centralizado de errores que extiende HttpException
 * Se puede usar directamente como excepción o con métodos estáticos
 */
export class ErrorHandler extends HttpException {
  private static readonly logger = new Logger(ErrorHandler.name);

  constructor(message: string, status?: HttpStatus) {
    super(message, status || HttpStatus.BAD_REQUEST);
  }

  /**
   * Maneja errores de recursos no encontrados
   */
  static notFound(resource: string, id?: string | number): never {
    this.logger.warn(`Resource not found: ${resource} ${id ? `with ID ${id}` : ''}`);
    const message = id ? `${resource} con ID ${id} no encontrado` : `${resource} no encontrado`;

    throw new ErrorHandler(message, HttpStatus.NOT_FOUND);
  }

  /**
   * Maneja errores de lógica de negocio
   */
  static businessLogic(message: string): never {
    this.logger.warn(`Business logic error: ${message}`);
    throw new ErrorHandler(message, HttpStatus.BAD_REQUEST);
  }

  /**
   * Maneja errores de duplicación
   */
  static duplicateResource(resource: string, field: string, value: any): never {
    this.logger.warn(`Duplicate resource: ${resource} with ${field} = ${value}`);
    const message = `Ya existe un ${resource} con ${field}: ${value}`;
    throw new ErrorHandler(message, HttpStatus.CONFLICT);
  }

  /**
   * Maneja errores de validación
   */
  static validation(message: string = 'Datos de entrada inválidos'): never {
    this.logger.warn(`Validation error: ${message}`);
    throw new ErrorHandler(message, HttpStatus.BAD_REQUEST);
  }

  /**
   * Maneja errores de autorización
   */
  static unauthorized(message: string = 'No autorizado'): never {
    this.logger.warn(`Unauthorized access: ${message}`);
    throw new ErrorHandler(message, HttpStatus.UNAUTHORIZED);
  }

  /**
   * Maneja errores de acceso denegado
   */
  static forbidden(message: string = 'Acceso denegado'): never {
    this.logger.warn(`Forbidden access: ${message}`);
    throw new ErrorHandler(message, HttpStatus.FORBIDDEN);
  }

  /**
   * Maneja errores de base de datos con análisis automático
   */
  static database(error: any, context?: string): never {
    this.logger.error(
      `Database error${context ? ` in ${context}` : ''}: ${error.message}`,
      error.stack,
    );

    // Manejo específico de errores de TypeORM
    if (error instanceof QueryFailedError) {
      const pgError = error.driverError as any;
      if (pgError?.code) {
        switch (pgError.code) {
          case '23505': // Violación de restricción única
            const detail = pgError.detail || '';
            const match = detail.match(/Key \(([^)]+)\)=\(([^)]+)\)/);
            if (match) {
              const field = match[1];
              const value = match[2];
              this.duplicateResource('registro', field, value);
            }
            throw new ErrorHandler('El registro ya existe', HttpStatus.CONFLICT);
          case '23503': // Violación de clave foránea
            throw new ErrorHandler('Referencia a registro inexistente', HttpStatus.BAD_REQUEST);
          case '23502': // Violación de NOT NULL
            throw new ErrorHandler('Campo requerido faltante', HttpStatus.BAD_REQUEST);
          case '42P01': // Tabla no existe
            throw new ErrorHandler('Recurso no encontrado', HttpStatus.NOT_FOUND);
        }
      }
    }

    if (error instanceof EntityNotFoundError) {
      throw new ErrorHandler('Registro no encontrado', HttpStatus.NOT_FOUND);
    }

    // Error genérico de base de datos
    throw new ErrorHandler('Error en la base de datos', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  /**
   * Maneja errores genéricos
   */
  static generic(error: any, context?: string): never {
    const message = error.message || 'Error desconocido';
    this.logger.error(`Generic error${context ? ` in ${context}` : ''}: ${message}`, error.stack);

    // Re-throw si ya es una excepción HTTP
    if (error instanceof HttpException) {
      throw error;
    }

    throw new ErrorHandler('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  /**
   * Registra un error sin lanzar excepción
   */
  static logError(error: any, context?: string): void {
    const message = error.message || 'Error desconocido';
    this.logger.error(`Error${context ? ` in ${context}` : ''}: ${message}`, error.stack);
  }

  /**
   * Registra una advertencia
   */
  static logWarning(message: string, context?: string): void {
    this.logger.warn(`Warning${context ? ` in ${context}` : ''}: ${message}`);
  }

  /**
   * Registra información
   */
  static logInfo(message: string, context?: string): void {
    this.logger.log(`Info${context ? ` in ${context}` : ''}: ${message}`);
  }

  /**
   * Método de conveniencia para validar que un recurso existe
   */
  static validateExists<T>(
    resource: T | null | undefined,
    resourceName: string,
    id?: string | number,
  ): T {
    if (!resource) {
      this.notFound(resourceName, id);
    }
    return resource as T;
  }

  /**
   * Método de conveniencia para validar condiciones de negocio
   */
  static validateBusinessRule(condition: boolean, message: string): void {
    if (!condition) {
      this.businessLogic(message);
    }
  }
}
