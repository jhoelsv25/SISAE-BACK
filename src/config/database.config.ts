import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuditSubscriber } from '../audit/subscribers/audit.subscriber';

const isProduction = process.env.NODE_ENV === 'production';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('database.host'),
  port: configService.get<number>('database.port'),
  username: configService.get<string>('database.username'),
  password: configService.get<string>('database.password'),
  database: configService.get<string>('database.name'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // Siempre false, usar migraciones
  logging: process.env.DB_LOGGING === 'true' ? ['error', 'warn', 'migration'] : false,
  logger: 'simple-console',
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  migrationsRun: false,
  subscribers: [AuditSubscriber],
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  namingStrategy: new SnakeNamingStrategy(),
  extra: {
    timezone: 'UTC',
    // En producción, configurar pool de conexiones
    ...(isProduction && {
      max: 20,
      min: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    }),
  },
});
