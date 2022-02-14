import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { FieldType } from '../../database/entities/field.entity';

class Field {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(FieldType)
  type: FieldType;

  @IsBoolean()
  isRequired: boolean;
}

export class CollectDataDto {
  @IsInt()
  fieldId: number;

  @IsString({ each: true })
  data: string[];
}
