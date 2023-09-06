import { Optional } from '@nestjs/common'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength
} from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string

  @Optional()
  @IsString()
  firstName: string | null

  @IsOptional()
  @IsString()
  lastName: string | null
}
