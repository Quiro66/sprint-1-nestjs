import { IsOptional, IsDate } from 'class-validator';

export class UpdateAdoptionDto {
  @IsOptional()
  @IsDate()
  adoptedAt?: Date;

  @IsOptional()
  @IsDate()
  releasedAt?: Date;
}
