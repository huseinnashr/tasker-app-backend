import { IsString, IsEnum, IsArray } from 'class-validator';
import { UpdateType } from '../../database/enum';

export class ManageUpdateDTO {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsEnum(UpdateType)
  type: UpdateType;

  @IsArray()
  files: number[];
}
