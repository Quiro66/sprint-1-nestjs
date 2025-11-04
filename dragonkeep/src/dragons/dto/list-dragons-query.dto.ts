import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { DragonStatus } from '../../common/enums/dragon-status.enum';
import { DragonType } from '../../common/enums/dragon-type.enum';

export class ListDragonsQueryDto {
  @ApiPropertyOptional({ enum: DragonStatus })
  @IsOptional()
  @IsEnum(DragonStatus)
  status?: DragonStatus;

  @ApiPropertyOptional({ enum: DragonType })
  @IsOptional()
  @IsEnum(DragonType)
  type?: DragonType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  minAge?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  maxAge?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  page: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  limit: number = 10;
}
