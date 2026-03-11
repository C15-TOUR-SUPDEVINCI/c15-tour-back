import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';

// MySQL error codes
const MYSQL_ERRORS: Record<
  string,
  {
    status: number;
    getMessage: (
      err: QueryFailedError & { sqlMessage?: string; errno?: number },
    ) => string;
  }
> = {
  ER_DUP_ENTRY: {
    status: HttpStatus.CONFLICT,
    getMessage: (err) => {
      // Extract the duplicate field from sqlMessage: "Duplicate entry 'value' for key 'table.field'"
      const match = err.sqlMessage?.match(
        /Duplicate entry '(.+)' for key '(.+)'/,
      );
      if (match) {
        const value = match[1];
        const key = match[2].replace(/^[^.]+\./, ''); // remove table prefix
        return `A record with ${key} = "${value}" already exists`;
      }
      return 'A record with this value already exists';
    },
  },
  ER_NO_REFERENCED_ROW_2: {
    status: HttpStatus.BAD_REQUEST,
    getMessage: (err) => {
      // Extract field name from constraint: "FOREIGN KEY (`organizerId`) REFERENCES `users`"
      const match = err.sqlMessage?.match(
        /FOREIGN KEY \(`(\w+)`\) REFERENCES `(\w+)`/,
      );
      if (match) {
        const field = match[1];
        const table = match[2];
        return `"${field}" references a ${table.replace(/s$/, '')} that does not exist`;
      }
      return 'A referenced resource does not exist';
    },
  },
  ER_ROW_IS_REFERENCED_2: {
    status: HttpStatus.CONFLICT,
    getMessage: (err) => {
      const match = err.sqlMessage?.match(/CONSTRAINT `(.+)` FOREIGN KEY/);
      if (match) {
        return `Cannot delete this record — it is still referenced by other data`;
      }
      return 'Cannot delete — this record is still in use';
    },
  },
  ER_DATA_TOO_LONG: {
    status: HttpStatus.BAD_REQUEST,
    getMessage: (err) => {
      const match = err.sqlMessage?.match(/for column '(\w+)'/);
      return match
        ? `Value for "${match[1]}" is too long`
        : 'One of the provided values is too long for the database field';
    },
  },
  ER_BAD_NULL_ERROR: {
    status: HttpStatus.BAD_REQUEST,
    getMessage: (err) => {
      const match = err.sqlMessage?.match(/Column '(\w+)'/);
      return match
        ? `Field "${match[1]}" cannot be null`
        : 'A required field is missing';
    },
  },
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // ── NestJS / HTTP exceptions (NotFoundException, BadRequestException, etc.) ──
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      return response.status(status).json(
        typeof exceptionResponse === 'object'
          ? {
              ...exceptionResponse,
              path: request.url,
              timestamp: new Date().toISOString(),
            }
          : {
              message: exceptionResponse,
              statusCode: status,
              path: request.url,
              timestamp: new Date().toISOString(),
            },
      );
    }

    // ── TypeORM / Database exceptions ──
    if (exception instanceof QueryFailedError) {
      const dbErr = exception as QueryFailedError & {
        code?: string;
        sqlMessage?: string;
        errno?: number;
      };
      const code = dbErr.code ?? '';
      const handler = MYSQL_ERRORS[code];

      if (handler) {
        const status = handler.status;
        const message = handler.getMessage(dbErr);
        this.logger.warn(
          `[DB ${code}] ${message} — ${request.method} ${request.url}`,
        );
        return response.status(status).json({
          statusCode: status,
          error: HttpStatus[status],
          message,
          path: request.url,
          timestamp: new Date().toISOString(),
        });
      }

      // Unknown DB error — log it but don't leak internals
      this.logger.error(
        `Unhandled DB error [${code}]: ${dbErr.message}`,
        dbErr.stack,
      );
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: 500,
        error: 'Internal Server Error',
        message:
          'A database error occurred. Please try again or contact support.',
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }

    // ── Unknown / unexpected exceptions ──
    this.logger.error(
      'Unhandled exception',
      exception instanceof Error ? exception.stack : String(exception),
    );
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
