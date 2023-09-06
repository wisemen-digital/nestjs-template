import { NestFactory } from '@nestjs/core'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { AppModule } from './app.module.js'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )
  app.setGlobalPrefix('api', {
    exclude: []
  })
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  })
  app.enableCors()

  await app.listen(3000)
}

await bootstrap()
