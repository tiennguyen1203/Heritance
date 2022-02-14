import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
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

export class CreateFormDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Field)
  fields: Field[];
}
