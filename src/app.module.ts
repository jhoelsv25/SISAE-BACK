import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { ExceptionsModule } from './common/exceptions/exceptions.module';
import configurationConfig from './config/configuration.config';
import { getDatabaseConfig } from './config/database.config';
import { FeatureModule } from './features/features.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurationConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
    }),
    ExceptionsModule,
    AuditModule,
    HealthModule,
    FeatureModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
