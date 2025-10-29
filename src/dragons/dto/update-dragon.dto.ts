import { PartialType } from '@nestjs/mapped-types';
import { CreateDragonDto } from './create-dragon.dto';

export class UpdateDragonDto extends PartialType(CreateDragonDto) {}
