import { IsString, IsEmail, MinLength, IsEnum } from 'class-validator'
import { UserRole } from '../../caretakers/caretaker.enums';

export class RegisterDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum( UserRole )
  role: UserRole;
  
}