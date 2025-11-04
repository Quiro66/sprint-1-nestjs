import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { DragonTypes } from '../dragon.enums';
import { DragonStatus } from '../dragon.enums';

export class ListDragonsQueryDto {
  @ApiPropertyOptional({
    enum: DragonStatus,
    description: 'Filtrar dragones por estado',
  })
  @IsOptional()
  @IsEnum(DragonStatus)
  status?: DragonStatus;

  @ApiPropertyOptional({
    enum: DragonTypes,
    description: 'Filtrar dragones por tipo',
  })
  @IsOptional()
  @IsEnum(DragonTypes)
  type?: DragonTypes;

  @ApiPropertyOptional({ description: 'Edad mínima del dragón', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  minAge?: number;

  @ApiPropertyOptional({ description: 'Edad máxima del dragón', example: 500 })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxAge?: number;

  @ApiPropertyOptional({ description: 'Número de página', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Cantidad de resultados por página', example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
