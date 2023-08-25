import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/users/user.module.js';
import { sslHelper } from './utils/typeorm.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'postgres',
      url: process.env.TYPEORM_URI,
      ssl: sslHelper(process.env.TYPEORM_SSL),
      extra: { max: 50 },
      logging: false,
      synchronize: true,
      migrationsRun: true,
      autoLoadEntities: true,
      // entities: mainModels,
      // migrations: mainMigrations
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
