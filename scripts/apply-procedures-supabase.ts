import { AppDataSource } from '../src/database/data-source';
import * as fs from 'fs';
import * as path from 'path';

async function applyProcedures() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection successful for procedures');

    const proceduresDir = path.join(__dirname, '../src/database/procedures');
    const files = fs.readdirSync(proceduresDir).filter(f => f.endsWith('.sql'));

    for (const file of files) {
      console.log(`⏳ Applying procedure: ${file}`);
      const sql = fs.readFileSync(path.join(proceduresDir, file), 'utf8');
      
      // Split by ';' if needed, but for procedures/functions, often they are one big block
      // TypeORM's query can handle multiple statements if supported by the driver, 
      // but usually for CREATE FUNCTION/PROCEDURE, it's safer to run as is if it's one block.
      await AppDataSource.query(sql);
      console.log(`✅ ${file} applied correctly`);
    }

    await AppDataSource.destroy();
    console.log('✨ All procedures were applied successfully!');
  } catch (error) {
    console.error('❌ Error applying procedures:', error);
    process.exit(1);
  }
}

applyProcedures();
