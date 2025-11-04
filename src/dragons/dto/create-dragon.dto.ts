import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsInt,
  Min,
  Max,
  MinLength,
  IsOptional,
} from 'class-validator';
import { DragonTypes } from '../dragon.enums';
import { DragonStatus } from '../dragon.enums';

export class CreateDragonDto {
  @ApiProperty({
    example: 'Smaug',
    description: 'Nombre único del dragón',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: DragonTypes.FIRE,
    enum: DragonTypes,
    description: 'Tipo elemental del dragón',
  })
  @IsEnum(DragonTypes)
  type: DragonTypes;

  @ApiProperty({
    example: 120,
    description: 'Edad del dragón en años',
  })
  @IsInt()
  @Min(1)
  age: number;

  @ApiProperty({
    example: 8,
    description: 'Nivel de agresividad (1-10)',
  })
  @IsInt()
  @Min(1)
  @Max(10)
  aggressivenessLevel: number;

  @ApiProperty({
    example: DragonStatus.AVAILABLE,
    enum: DragonStatus,
    description: 'Estado actual del dragón',
    default: DragonStatus.AVAILABLE,
    required: false,
  })
  @IsOptional()
  @IsEnum(DragonStatus)
  status?: DragonStatus = DragonStatus.AVAILABLE;
}
