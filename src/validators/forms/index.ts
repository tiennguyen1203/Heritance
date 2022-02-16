import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { FieldType } from '../../database/entities/field.entity';

@ApiModel({
  description: 'Create form payload field',
  name: 'Field',
})
class Field {
  @ApiModelProperty({
    description: 'field name',
    required: true,
    example: 'userName',
  })
  @IsString()
  name: string;

  @ApiModelProperty({
    description: 'field type',
    required: true,
    example: 'text',
  })
  @IsEnum(FieldType)
  type: FieldType;

  @ApiModelProperty({
    description: 'specify if field is required',
    required: true,
    example: true,
  })
  @IsBoolean()
  isRequired: boolean;
}

@ApiModel({
  description: 'Create form payload',
  name: 'CreateFormDto',
})
export class CreateFormDto {
  @ApiModelProperty({
    description: 'Form name',
    required: true,
    example: 'Form 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiModelProperty({
    description: 'form fields',
    required: true,
    model: 'Field',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Field)
  fields: Field[];
}
