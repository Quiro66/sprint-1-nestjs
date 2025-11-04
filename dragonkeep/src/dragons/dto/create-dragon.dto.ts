import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { DragonType } from '../../common/enums/dragon-type.enum';

export class CreateDragonDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  age!: number;

  @ApiProperty({ enum: DragonType })
  @IsEnum(DragonType)
  type!: DragonType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  temperament?: string;
}
