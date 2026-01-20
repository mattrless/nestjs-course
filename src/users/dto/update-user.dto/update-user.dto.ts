import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(4)
  password: string;

  @IsEmail()
  @IsOptional()
  email: string;
}
