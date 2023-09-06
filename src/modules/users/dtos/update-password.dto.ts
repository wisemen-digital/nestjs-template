import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string

  @IsString()
  @MinLength(6)
  password: string
}
