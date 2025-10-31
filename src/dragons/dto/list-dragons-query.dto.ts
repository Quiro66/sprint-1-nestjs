import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { DragonStatus, FireType } from '../../entities/dragon.entity';

export class ListDragonsQueryDto {
  @IsOptional()
  @IsEnum(DragonStatus)
  status?: DragonStatus;

  @IsOptional()
  @IsEnum(FireType)
  fireType?: FireType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

