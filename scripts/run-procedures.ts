import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'sisae_db',
  namingStrategy: new SnakeNamingStrategy(),
});

async function run() {
  console.log('🚀 Iniciando actualización de procedimientos SQL...');
  
  try {
    await AppDataSource.initialize();
    console.log('✅ Conexión establecida con la base de datos');
    
    const proceduresDir = path.join(process.cwd(), 'src/database/procedures');
    const files = fs.readdirSync(proceduresDir).filter(f => f.endsWith('.sql'));
    
    for (const file of files) {
      console.log(`  ⚙️  Ejecutando: ${file}`);
      const sql = fs.readFileSync(path.join(proceduresDir, file), 'utf8');
      if (sql.trim()) {
        await AppDataSource.query(sql);
      }
    }
    
    console.log('✨ Todos los procedimientos han sido actualizados');
  } catch (error) {
    console.error('❌ Error al actualizar procedimientos:', error.message);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(0);
  }
}

run();
