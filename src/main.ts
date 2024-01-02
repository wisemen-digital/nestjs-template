import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
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

  const config = new DocumentBuilder()
    .setTitle('Easy2Drop API')
    .setDescription('The Easy2Drop API description')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api', app, document)

  await app.listen(3000)
}

await bootstrap()
