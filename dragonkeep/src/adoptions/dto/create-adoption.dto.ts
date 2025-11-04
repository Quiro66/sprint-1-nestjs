import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateAdoptionDto {
  @ApiProperty()
  @IsUUID()
  @IsString()
  dragonId!: string;
}
