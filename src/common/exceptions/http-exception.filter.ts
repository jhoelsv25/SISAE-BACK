import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorHandler } from './error-handler';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Error interno del servidor';
    let context: string | undefined;
    let stack: string | undefined;

    // Manejar ErrorHandler personalizado
    if (exception instanceof ErrorHandler) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;
      message = exceptionResponse.message || message;
      context = exceptionResponse.context;
    }
    // Manejar HttpException de NestJS (incluye ConflictException, BadRequestException, etc.)
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        if (Array.isArray(message)) {
          message = message.join(', ');
        }
      }
    }
    // Manejar errores de base de datos
    else if (exception && typeof exception === 'object' && 'code' in exception) {
      const dbError = exception as any;
      context = 'Database';

      switch (dbError.code) {
        case '23505': // Violación de unique constraint
          status = HttpStatus.CONFLICT;
          // Priorizar mensaje si existe (por ejemplo, lanzado por ConflictException)
          message = dbError.detail || 'Ya existe un registro con estos datos';
          break;
        case '23503': // Violación de foreign key
          status = HttpStatus.BAD_REQUEST;
          message = dbError.detail || 'Referencia inválida a otro registro';
          break;
        case '23502': // Violación de not null
          status = HttpStatus.BAD_REQUEST;
          message = dbError.detail || 'Falta un campo requerido';
          break;
        default:
          message = dbError.message || 'Error en la base de datos';
      }
    }
    // Manejar errores genéricos de JavaScript
    else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
    }

    // Log del error
    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Error: ${message}`,
      stack,
    );

    // Construir la respuesta JSON
    const errorResponse: any = {
      statusCode: status,
      message,
      ...(context && { context }),
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (process.env.NODE_ENV === 'development' && stack) {
      errorResponse.stack = stack;
    }

    response.status(status).json(errorResponse);
  }
}

/**
 * Alias para compatibilidad
 */
export { GlobalExceptionFilter as HttpExceptionFilter };
