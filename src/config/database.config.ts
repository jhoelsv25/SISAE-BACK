import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('database.host'),
  port: configService.get<number>('database.port'),
  username: configService.get<string>('database.username'),
  password: configService.get<string>('database.password'),
  database: configService.get<string>('database.name'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production', // Solo en desarrollo
  logging: process.env.DB_LOGGING === 'true' ? ['error', 'warn', 'schema'] : false,
  logger: 'simple-console', // Logger simple solo para errores
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsRun: false,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  extra: {
    // Configuraciones adicionales de PostgreSQL
    timezone: 'UTC',
  },
});
