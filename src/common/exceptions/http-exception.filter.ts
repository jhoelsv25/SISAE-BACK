import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let error = 'Internal Server Error';
    let details: any = null;

    // Manejo de excepciones HTTP de NestJS
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        error = (exceptionResponse as any).error || error;
        details = (exceptionResponse as any).details || null;
      }
    }
    // Manejo de errores de base de datos
    else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Error en la consulta de base de datos';
      error = 'Database Query Error';

      // Errores específicos de PostgreSQL
      const pgError = exception.driverError as any;
      if (pgError?.code) {
        switch (pgError.code) {
          case '23505': // Violación de restricción única
            message = 'El registro ya existe';
            error = 'Duplicate Entry';
            details = this.extractDuplicateField(pgError.detail);
            break;
          case '23503': // Violación de clave foránea
            message = 'Referencia a registro inexistente';
            error = 'Foreign Key Violation';
            break;
          case '23502': // Violación de NOT NULL
            message = 'Campo requerido faltante';
            error = 'Required Field Missing';
            break;
          case '42P01': // Tabla no existe
            message = 'Recurso no encontrado';
            error = 'Resource Not Found';
            break;
          default:
            message = 'Error en la base de datos';
            details = pgError.message;
        }
      }
    }
    // Manejo de entidad no encontrada
    else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Registro no encontrado';
      error = 'Entity Not Found';
    }
    // Manejo de errores de validación
    else if (exception instanceof Error && exception.name === 'ValidationError') {
      status = HttpStatus.BAD_REQUEST;
      message = 'Datos de entrada inválidos';
      error = 'Validation Error';
      details = exception.message;
    }
    // Otros errores
    else if (exception instanceof Error) {
      message = exception.message || 'Error desconocido';
      details = exception.stack;
    }

    // Estructura de respuesta de error estandarizada
    const errorResponse = {
      success: false,
      statusCode: status,
      error,
      message,
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception instanceof Error ? exception.stack : null,
      }),
    };

    // Log del error solo si no es 404 y estamos en desarrollo
    if (status !== HttpStatus.NOT_FOUND || process.env.NODE_ENV === 'development') {
      if (process.env.NODE_ENV === 'development') {
        this.logger.error(
          `${request.method} ${request.url} - Status: ${status} - Error: ${message}`,
          exception instanceof Error ? exception.stack : exception,
        );
      } else {
        // En producción, solo log básico para errores no-404
        if (status !== HttpStatus.NOT_FOUND) {
          this.logger.error(
            `${request.method} ${request.url} - Status: ${status} - Error: ${message}`,
          );
        }
      }
    }

    response.status(status).json(errorResponse);
  }

  private extractDuplicateField(detail: string): string | null {
    if (!detail) return null;

    // Extraer el campo duplicado del mensaje de error de PostgreSQL
    const match = detail.match(/Key \(([^)]+)\)=/);
    return match ? match[1] : null;
  }
}
