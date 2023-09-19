import { Module } from '@nestjs/common'
import { UserSeederModule } from './modules/users/tests/user-seeder.module.js'

@Module({
  imports: [
    UserSeederModule
  ],
  providers: [
  ]
})
export class SeederModule {}
