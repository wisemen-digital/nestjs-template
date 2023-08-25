import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName: string | null;

  @IsString()
  @IsOptional()
  lastName: string | null;
}
