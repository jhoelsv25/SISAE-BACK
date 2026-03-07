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

    if (exception instanceof ErrorHandler) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;
      message = exceptionResponse.message || message;
      context = exceptionResponse.context;
    } else if (exception instanceof HttpException) {
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
    // Manejar errores de base de datos (TypeORM QueryFailedError o errores directos de pg)
    else if (exception && typeof exception === 'object') {
      const err = exception as any;
      const dbError = err.driverError ?? err;
      const code = dbError?.code;

      if (code) {
        context = 'Database';
        switch (code) {
          case '23505': // Violación de unique constraint
            status = HttpStatus.CONFLICT;
            message = 'Ya existe un registro con estos datos.';
            break;
          case '23503': // Violación de foreign key
            status = HttpStatus.BAD_REQUEST;
            message = 'La referencia seleccionada no es válida. Verifique los datos.';
            break;
          case '23502': // Violación de not null
            status = HttpStatus.BAD_REQUEST;
            message = 'Falta completar un campo requerido. Por favor revise los datos.';
            break;
          default:
            message = 'Ocurrió un error al procesar la solicitud. Intente nuevamente.';
        }
      } else if (err instanceof Error || (err.message && typeof err.message === 'string')) {
        message = err.message;
        stack = err.stack;
        // Reemplazar mensajes técnicos de BD por mensajes comprensibles
        if (
          typeof message === 'string' &&
          (message.includes('Failing row') || message.includes('QueryFailedError'))
        ) {
          message =
            'Ocurrió un error al guardar los datos. Por favor revise que todos los campos requeridos estén completos.';
          status = HttpStatus.BAD_REQUEST;
        }
      }
    }
    // Manejar errores genéricos de JavaScript
    else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
      // Sanitizar mensajes técnicos
      if (
        typeof message === 'string' &&
        (message.includes('Failing row') || message.includes('QueryFailedError'))
      ) {
        message =
          'Ocurrió un error al guardar los datos. Por favor revise que todos los campos requeridos estén completos.';
        status = HttpStatus.BAD_REQUEST;
      }
    }

    // Log del error
    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Error: ${message}`,
      stack,
    );

    // Sanitizar mensajes técnicos antes de enviar al cliente (siempre en español, comprensibles para el usuario)
    const msg =
      typeof message === 'string'
        ? message
        : Array.isArray(message)
          ? message.join(', ')
          : String(message);
    const isTechnicalMessage =
      msg.includes('Failing row') ||
      msg.includes('QueryFailedError') ||
      msg.includes('violates not-null') ||
      msg.includes('violates check constraint') ||
      msg.includes('duplicate key') ||
      msg.includes('null value in column');
    const sanitizedMessage = isTechnicalMessage
      ? 'Ocurrió un error al guardar los datos. Por favor revise que todos los campos requeridos estén completos.'
      : msg;

    // Construir la respuesta JSON
    const errorResponse: any = {
      statusCode: status,
      message: sanitizedMessage,
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
