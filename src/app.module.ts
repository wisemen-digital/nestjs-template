import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { sslHelper } from './utils/typeorm.js'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { PermissionsGuard } from './modules/permissions/permissions.guard.js'
import { AuthGuard } from './modules/auth/auth.guard.js'
import { AuthModule } from './modules/auth/auth.module.js'
import { UserModule } from './modules/users/user.module.js'

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
      autoLoadEntities: true
      // entities: mainModels,
      // migrations: mainMigrations
    }),
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard
    },
  ]
})
export class AppModule {}
