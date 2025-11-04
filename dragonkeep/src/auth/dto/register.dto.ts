import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ enum: Role, default: Role.CARETAKER })
  @IsEnum(Role)
  role!: Role;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullName?: string;
}
