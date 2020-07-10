import { IsString, IsEnum } from 'class-validator';
import { UpdateType } from '../../database/enum';

export class ManageUpdateDTO {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsEnum(UpdateType)
  type: UpdateType;
}
