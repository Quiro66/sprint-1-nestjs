import { IsString, IsInt, IsEnum, Min, Max, IsOptional } from 'class-validator';
import { FireType, DragonStatus } from '../../entities/dragon.entity';

export class CreateDragonDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  age: number;

  @IsString()
  breed: string;

  @IsEnum(FireType)
  fireType: FireType;

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  aggressionLevel?: number = 0;

  @IsEnum(DragonStatus)
  @IsOptional()
  status?: DragonStatus = DragonStatus.AVAILABLE;
}

