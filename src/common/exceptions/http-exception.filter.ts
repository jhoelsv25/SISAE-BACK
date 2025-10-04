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

/**
 * GlobalExceptionFilter - Filtro global para capturar todas las excepciones
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let context: string | undefined;
    let stack: string | undefined;

    // Manejar ErrorHandler personalizado
    if (exception instanceof ErrorHandler) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;
      message = exceptionResponse.message || message;
      context = exceptionResponse.context;
    }
    // Manejar HttpException de NestJS
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        // Si es un array de mensajes (como en validaciones)
        if (Array.isArray((exceptionResponse as any).message)) {
          message = (exceptionResponse as any).message.join(', ');
        }
      }
    }
    // Manejar errores de base de datos
    else if (exception && typeof exception === 'object' && 'code' in exception) {
      const dbError = exception as any;

      switch (dbError.code) {
        case '23505': // Violación de unique constraint
          status = HttpStatus.CONFLICT;
          message = 'Ya existe un registro con estos datos';
          break;
        case '23503': // Violación de foreign key
          status = HttpStatus.BAD_REQUEST;
          message = 'Referencia inválida a otro registro';
          break;
        case '23502': // Violación de not null
          status = HttpStatus.BAD_REQUEST;
          message = 'Falta un campo requerido';
          break;
        default:
          message = 'Error en la base de datos';
      }
      context = 'Database';
    }
    // Manejar errores genéricos
    else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
    }

    // Log del error
    const errorLog = {
      method: request.method,
      url: request.url,
      status,
      message,
      context,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { stack }),
    };

    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Error: ${message}`,
      stack,
    );

    // Respuesta al cliente
    const errorResponse = {
      statusCode: status,
      message,
      ...(context && { context }),
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(process.env.NODE_ENV === 'development' && stack && { stack }),
    };

    response.status(status).json(errorResponse);
  }
}

/**
 * HttpExceptionFilter - Alias para compatibilidad
 */
export { GlobalExceptionFilter as HttpExceptionFilter };
