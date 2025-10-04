import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const baseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'sisae_db',
  entities: isProduction ? ['dist/**/*.entity.js'] : ['src/**/*.entity{.ts,.js}'],
  migrations: isProduction
    ? ['dist/database/migrations/*.js']
    : ['src/database/migrations/*{.ts,.js}'],
  synchronize: false, // Siempre false, usar migraciones
  logging: process.env.DB_LOGGING === 'true' ? ['error', 'warn', 'migration'] : false,
  namingStrategy: new SnakeNamingStrategy(),
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  extra: {
    timezone: 'UTC',
    // En producción, configurar pool de conexiones
    ...(isProduction && {
      max: 20, // Máximo de conexiones
      min: 5, // Mínimo de conexiones
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    }),
  },
};

export const AppDataSource = new DataSource(baseConfig);
