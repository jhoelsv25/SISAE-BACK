// Tipos públicos para la respuesta de salud de la base de datos
export interface DatabaseSize {
  bytes: number;
  human: string;
}

export interface TableInfo {
  name: string;
  type: string;
}

export interface TablesInfo {
  count: number;
  list: TableInfo[];
}

export interface DatabaseHealthResponse {
  status: 'healthy' | 'unhealthy';
  connection: boolean;
  database: string;
  user: string;
  version: string;
  size: DatabaseSize;
  tables: TablesInfo;
  timestamp: string;
  error?: string;
}

import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getHealth() {
    const healthInfo = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: 'unknown',
        connection: false,
        type: 'postgresql',
        version: '', // Added version property to avoid type error
        tables: 0, // Added tables property to fix type error
        error: '', // Added error property to fix type error
      },
      services: {
        api: 'healthy',
        auth: 'healthy',
      },
    };

    // Test database connection
    try {
      await this.dataSource.query('SELECT 1');
      healthInfo.database.status = 'healthy';
      healthInfo.database.connection = true;

      // Get database info
      const dbInfo = await this.dataSource.query('SELECT version()');
      healthInfo.database['version'] =
        dbInfo[0].version.split(' ')[0] + ' ' + dbInfo[0].version.split(' ')[1];

      // Count tables
      const tables = await this.dataSource.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      healthInfo.database['tables'] = parseInt(tables[0].count);
    } catch (error) {
      healthInfo.status = 'degraded';
      healthInfo.database.status = 'unhealthy';
      healthInfo.database.connection = false;
      healthInfo.database['error'] = error instanceof Error ? error.message : String(error);
    }

    return healthInfo;
  }

  @Get('db')
  async getDatabaseHealth(): Promise<
    | DatabaseHealthResponse
    | { status: string; connection: boolean; error: string; timestamp: string }
  > {
    try {
      // Test basic connection
      await this.dataSource.query('SELECT 1');

      // Get database statistics
      const stats = await this.dataSource.query(`
        SELECT 
          current_database() as database_name,
          current_user as current_user,
          version() as version,
          pg_database_size(current_database()) as size_bytes
      `);

      const tables = await this.dataSource.query(`
        SELECT 
          table_name,
          table_type
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);

      return {
        status: 'healthy',
        connection: true,
        database: stats[0].database_name,
        user: stats[0].current_user,
        version: stats[0].version.split(' ')[0] + ' ' + stats[0].version.split(' ')[1],
        size: {
          bytes: parseInt(stats[0].size_bytes),
          human: this.formatBytes(parseInt(stats[0].size_bytes)),
        },
        tables: {
          count: tables.length,
          list: tables.map((t: any) => ({ name: t.table_name, type: t.table_type })),
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        connection: false,
        error: error?.message as string,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
